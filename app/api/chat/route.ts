import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/data/prompts';
import { regulations } from '@/data/regulations';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const MAX_REQUEST_BYTES = 8_000;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_TOTAL_CONTENT_LENGTH = 4_000;
const MAX_MESSAGES = 8;

// DeepSeek 兼容 OpenAI SDK，只需改 baseURL
const deepseek = createOpenAI({
  baseURL: process.env.AI_API_BASE_URL || 'https://api.deepseek.com',
  apiKey: process.env.AI_API_KEY,
});

// 从 regulations.ts 动态生成法规要点
function generateRegulationContext(): string {
  const verifiedRegs = regulations.filter(r => r.lastVerified !== '待核实');
  const contextLines = verifiedRegs.map((reg, index) => {
    const officialUrlText = reg.officialUrl ? `（官方链接：${reg.officialUrl}）` : '';
    return `${index + 1}. 《${reg.title}》${officialUrlText}
   - ${reg.summary}`;
  });

  return `以下是本站收录的法规要点摘要（已核验），你的回答应参考这些内容：

${contextLines.join('\n\n')}

以上内容仅供参考，具体以官方原文为准。
`;
}

const REGULATION_CONTEXT = generateRegulationContext();

/**
 * AI 聊天代理 — M5 阶段使用 Vercel AI SDK + DeepSeek 流式输出
 *
 * 硬性约束：
 * - API key 只从服务端环境变量读取
 * - 模型名走 process.env.AI_MODEL，不写死
 * - 不保存对话记录
 * - 回答必须包含免责声明（由系统提示词强制；流式输出暂不做后置追加，
 *   前端 UI 已固定展示 DisclaimerBox 作为兜底保障）
 * - 问题长度限制 1000 字
 */
export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return jsonError('请求内容过长，请精简问题后重试。', 413);
    }

    const bodyText = await request.text();
    if (new TextEncoder().encode(bodyText).length > MAX_REQUEST_BYTES) {
      return jsonError('请求内容过长，请精简问题后重试。', 413);
    }

    let body: { messages?: unknown };
    try {
      body = JSON.parse(bodyText) as { messages?: unknown };
    } catch {
      return jsonError('请求格式不正确，请刷新后重试。', 400);
    }

    const messages = sanitizeMessages(body.messages);
    const latestMessage = messages.at(-1);

    if (!latestMessage || latestMessage.role !== 'user') {
      return jsonError('请先输入要咨询的问题。', 400);
    }

    if (latestMessage.content.length > MAX_MESSAGE_LENGTH) {
      return jsonError('问题内容过长，请控制在 1000 字以内。', 413);
    }

    const totalContentLength = messages.reduce(
      (sum, message) => sum + message.content.length,
      0
    );
    if (totalContentLength > MAX_TOTAL_CONTENT_LENGTH) {
      return jsonError('对话内容过长，请开启新的咨询。', 413);
    }

    // 如果没有配置 API key，回退到 mock 模式
    if (!process.env.AI_API_KEY) {
      const mockAnswer = generateMockAnswer(latestMessage.content);
      return new Response(
        JSON.stringify({ answer: mockAnswer, model: 'mock' }),
        { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 使用 Vercel AI SDK 流式输出
    const result = streamText({
      model: deepseek(process.env.AI_MODEL || 'deepseek-chat'),
      system: SYSTEM_PROMPT + '\n\n' + REGULATION_CONTEXT,
      messages,
      maxOutputTokens: 800,
      temperature: 0.3,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    // 区分客户端错误和服务端错误
    const isClientError = err instanceof SyntaxError;
    const status = isClientError ? 400 : 500;
    const message = isClientError
      ? '请求格式不正确，请刷新后重试。'
      : '服务暂时不可用，请稍后重试。';
    return jsonError(message, status);
  }
}

/**
 * Mock 回答 — 无 API key 时使用
 */
function generateMockAnswer(question: string): string {
  const questionType = inferQuestionType(question);
  const relatedRegulations = selectRelatedRegulations(question);

  return `问题类型识别：${questionType}

可先保留的证据清单：
1. 订单记录、派单记录、超时或取消记录
2. 收入流水、扣款通知、奖惩明细
3. 平台规则、协议、站点或平台通知
4. 与站长、平台客服、商家或用户的沟通记录
5. 如涉及受伤，保留事故经过、报警或平台报备记录、医疗票据

可能相关的规则：
${relatedRegulations}

下一步建议：
1. 先把上述材料按时间顺序整理成清单。
2. 拨打 12348，说明城市、平台、扣款或受伤经过，并询问当地处理入口。
3. 到法律援助目录查询当地法律援助中心；必要时再咨询劳动监察、调解仲裁窗口或正规律师。
4. 如果材料不足，先补齐截图、流水、通知和沟通记录，不要只依赖口头描述。

免责声明：本回答只提供法律信息，不构成律师法律意见。具体维权请咨询 12348 或当地法律援助中心。`;
}

function selectRelatedRegulations(question: string): string {
  const relatedIds = getRelatedRegulationIds(question);
  const relatedRegs = relatedIds
    .map((id) => regulations.find((reg) => reg.id === id))
    .filter((reg): reg is (typeof regulations)[number] => Boolean(reg));

  return relatedRegs
    .map((reg) => {
      const officialUrl = reg.officialUrl
        ? `\n  官方链接：${reg.officialUrl}`
        : '';

      return `- 《${reg.title}》：${reg.summary}${officialUrl}`;
    })
    .join('\n');
}

function getRelatedRegulationIds(question: string): string[] {
  if (/扣|罚|超时|差评|工资|收入|报酬/.test(question)) {
    return ['reg-001', 'reg-002', 'reg-003'];
  }
  if (/伤|事故|摔|撞|医疗|医院|职业伤害|工伤/.test(question)) {
    return ['reg-010', 'reg-007', 'reg-001'];
  }
  if (/合同|劳动关系|社保|保险/.test(question)) {
    return ['reg-006', 'reg-009', 'reg-001'];
  }
  if (/封号|停用|退出|申诉|规则/.test(question)) {
    return ['reg-003', 'reg-001', 'reg-004'];
  }
  if (/法援|援助|律师|12348/.test(question)) {
    return ['reg-008', 'reg-004', 'reg-001'];
  }

  return ['reg-001', 'reg-004', 'reg-008'];
}

function inferQuestionType(question: string) {
  if (/扣|罚|超时|差评/.test(question)) {
    return '平台扣罚 / 劳动报酬';
  }
  if (/伤|事故|摔|撞|医疗|医院/.test(question)) {
    return '送餐受伤 / 职业伤害';
  }
  if (/合同|劳动关系|社保/.test(question)) {
    return '劳动关系认定';
  }
  if (/封号|停用|退出|申诉/.test(question)) {
    return '平台规则 / 账号申诉';
  }
  if (/法援|援助|律师|12348/.test(question)) {
    return '法律援助路径';
  }

  return '劳动权益咨询';
}

function sanitizeMessages(rawMessages: unknown): ChatMessage[] {
  if (!Array.isArray(rawMessages)) {
    return [];
  }

  return rawMessages.reduce<ChatMessage[]>((acc, raw) => {
    if (typeof raw !== 'object' || raw === null) return acc;
    const msg = raw as Record<string, unknown>;
    if (
      (msg.role === 'user' || msg.role === 'assistant') &&
      typeof msg.content === 'string'
    ) {
      const trimmed = msg.content.trim();
      if (trimmed.length > 0) {
        acc.push({ role: msg.role, content: trimmed });
      }
    }
    return acc;
  }, []).slice(-MAX_MESSAGES);
}

function jsonError(error: string, status: number) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
