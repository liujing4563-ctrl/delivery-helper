'use client';

import { useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DisclaimerBox from '@/components/DisclaimerBox';

const EXAMPLES = [
  '平台扣了我超时罚款，我应该先保留哪些材料？',
  '我送餐受伤了，想知道可以先咨询哪些渠道。',
  '我没有签劳动合同，怎么梳理劳动关系线索？',
];

const TOPIC_QUESTIONS: Record<string, string> = {
  deduction: '平台扣了我超时罚款，我应该先保留哪些材料？',
  injury: '我送餐受伤了，想知道可以先咨询哪些渠道。',
  blocked: '我的账号被封了，想知道怎么申诉。',
  contract: '我没有签劳动合同，怎么梳理劳动关系线索？',
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

/** 生成唯一 ID，避免 Date.now() 在快速操作时冲突 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 pb-4 pt-6">
          <h1 className="text-xl font-bold text-gray-900">AI 骑手权益信息助手</h1>
          <p className="mt-2 text-sm text-gray-400">加载中…</p>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: unknown };
    if (typeof data.error === 'string' && data.error.trim()) {
      return data.error;
    }
  } catch {
    // 使用兜底文案，避免异常细节暴露给用户。
  }

  return '请求失败，请稍后重试。';
}

function ChatContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || '';
  const initialInput = TOPIC_QUESTIONS[topic] || '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialInput);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /** 取消正在进行的流式请求 */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 取消上一次请求（如果还在进行）
    cancelRequest();

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      // 检查是否是流式响应
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('text/plain') || contentType.includes('text/event-stream')) {
        // 流式响应
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';
        const assistantId = generateId();

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: 'assistant', content: '' },
        ]);

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: assistantContent } : m
            )
          );
        }
      } else {
        // JSON 响应（mock 模式）
        const data = await response.json();
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.answer || '无法获取回答',
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // 用户主动取消，不显示错误
        return;
      }
      setError(err instanceof Error ? err.message : '请求失败，请重试');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      // 找到最后一条用户消息的位置，删除它之后的所有消息
      const lastUserIndex = messages.map((m) => m.role).lastIndexOf('user');
      if (lastUserIndex >= 0) {
        setInput(messages[lastUserIndex].content);
        setMessages((prev) => prev.slice(0, lastUserIndex));
      }
    }
  };

  const handleStop = () => {
    cancelRequest();
    setIsLoading(false);
  };

  return (
    <div className="px-4 pb-4 pt-6">
      <h1 className="text-xl font-bold text-gray-900">AI 骑手权益信息助手</h1>
      <p className="mt-1 text-sm text-gray-500">
        只做劳动权益信息和路径引导，不替代律师。
      </p>

      <div className="mt-4">
        <DisclaimerBox />
      </div>

      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-800">
        当前版本支持流式响应，AI 会逐步输出回答。
        请不要输入个人敏感信息（身份证、银行卡等）。
      </div>

      <div className="mt-4 space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-900">可以这样问</p>
            <div className="mt-3 space-y-2">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setInput(example)}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg border p-3 text-sm leading-6 ${
                message.role === 'user'
                  ? 'border-blue-200 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <p className="mb-1 text-xs font-semibold text-gray-500">
                {message.role === 'user' ? '我的问题' : '助手回答'}
              </p>
              <p className="whitespace-pre-line">{message.content}</p>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            正在整理信息…
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-2 text-sm font-medium text-red-600 underline"
            >
              重试
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
        <label className="block text-sm font-medium text-gray-700" htmlFor="chat-input">
          描述你遇到的问题
        </label>
        <textarea
          id="chat-input"
          value={input}
          maxLength={1000}
          rows={4}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例如：平台扣款、工资太低、送餐受伤、没签合同、被封号…"
          className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm leading-6 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-gray-400">{input.length}/1000</span>
          <div className="flex gap-2">
            {isLoading && (
              <button
                type="button"
                onClick={handleStop}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                停止
              </button>
            )}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isLoading ? '发送中' : '发送'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
