'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type ProblemType = 'deduction' | 'injury' | 'blocked' | 'contract' | 'low-pay';

interface EvidenceItem {
  id: string;
  text: string;
  how: string;
  importance: '必须' | '建议' | '可选';
}

const PROBLEM_LABELS: Record<ProblemType, string> = {
  deduction: '被扣钱',
  injury: '送餐受伤',
  blocked: '被封号',
  contract: '没签合同',
  'low-pay': '工资太低',
};

const UNIVERSAL_EVIDENCE: EvidenceItem[] = [
  { id: 'u-identity', text: '身份证正反面照片', how: '手机拍照，确保清晰完整', importance: '必须' },
  { id: 'u-agreement', text: '平台协议/注册协议截图', how: '打开骑手 app → 设置/关于 → 协议/条款 → 截图保存', importance: '必须' },
  { id: 'u-income', text: '收入流水（银行或 app 内）', how: '银行 app 导出流水，或骑手 app 收入明细页截图', importance: '必须' },
  { id: 'u-chat', text: '与站长/平台的沟通记录', how: '微信/钉钉聊天记录截图，保留时间戳', importance: '建议' },
  { id: 'u-work-screenshot', text: '骑手 app 个人信息页截图', how: '显示注册时间、所属站点、骑手等级等', importance: '建议' },
  { id: 'u-uniform', text: '工服/工牌/保温箱照片', how: '拍照，需显示平台或公司标识', importance: '建议' },
];

const SPECIFIC_EVIDENCE: Record<ProblemType, EvidenceItem[]> = {
  deduction: [
    { id: 'd-notice', text: '扣款通知截图', how: '骑手 app 内的扣款明细/处罚通知 → 截图', importance: '必须' },
    { id: 'd-order', text: '相关订单详情截图', how: '被扣款订单的完整详情页面 → 截图', importance: '必须' },
    { id: 'd-rules', text: '平台扣款规则截图', how: 'app 内的处罚规则/考核标准页面 → 截图', importance: '建议' },
    { id: 'd-appeal', text: '申诉记录和回复', how: 'app 内申诉页面的完整对话 → 截图', importance: '建议' },
  ],
  injury: [
    { id: 'i-scene', text: '事故现场照片', how: '拍摄事故地点、车辆/路况、受伤部位', importance: '必须' },
    { id: 'i-medical', text: '医院诊断证明和病历', how: '就诊时保留纸质或电子病历、诊断书', importance: '必须' },
    { id: 'i-receipts', text: '医疗费用票据', how: '保留所有挂号费、检查费、药费、住院费发票', importance: '必须' },
    { id: 'i-police', text: '交通事故认定书（如有）', how: '报警后交警出具的责任认定书', importance: '建议' },
    { id: 'i-order-proof', text: '当时正在送单的证明', how: '事故时间段内的 app 订单详情截图', importance: '建议' },
  ],
  blocked: [
    { id: 'b-notice', text: '封号/限制通知截图', how: 'app 弹出的封号通知或短信 → 截图', importance: '必须' },
    { id: 'b-reason', text: '封号原因说明', how: 'app 内显示的封号理由/违规说明 → 截图', importance: '必须' },
    { id: 'b-appeal', text: '申诉记录', how: 'app 内或客服热线的申诉过程和回复', importance: '建议' },
    { id: 'b-history', text: '历史接单和评分记录', how: 'app 内的接单统计、好评率等数据 → 截图', importance: '可选' },
  ],
  contract: [
    { id: 'c-schedule', text: '排班/考勤记录', how: 'app 内的排班表或打卡记录 → 截图', importance: '必须' },
    { id: 'c-dispatch', text: '派单记录', how: 'app 内历史派单列表 → 截图（体现平台管理行为）', importance: '必须' },
    { id: 'c-punishment', text: '处罚/考核记录', how: '罚款通知、超时处罚、差评扣款记录', importance: '建议' },
    { id: 'c-training', text: '培训通知/会议记录', how: '微信群通知、培训签到截图', importance: '建议' },
    { id: 'c-tools', text: '装备采购/发放记录', how: '保温箱、工服等由公司发放的证据', importance: '可选' },
  ],
  'low-pay': [
    { id: 'l-detail', text: '收入明细截图', how: '骑手 app 内每日/每周/每月收入详情 → 截图', importance: '必须' },
    { id: 'l-hours', text: '在线时长记录', how: 'app 内显示的在线接单时间统计 → 截图', importance: '必须' },
    { id: 'l-deduction', text: '各项扣款明细', how: '保险费、装备费、服务费等扣款记录', importance: '建议' },
    { id: 'l-bank', text: '银行实际到账流水', how: '银行 app 导出工资入账记录', importance: '建议' },
  ],
};

function getStoredChecks(): Record<string, boolean> {
  try {
    const saved = localStorage.getItem('evidence-checks');
    return saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function getStoredNotes(): Record<string, string> {
  try {
    const saved = localStorage.getItem('evidence-notes');
    return saved ? (JSON.parse(saved) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export default function EvidencePage() {
  const [problem, setProblem] = useState<ProblemType | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChecks(getStoredChecks());
    setNotes(getStoredNotes());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem('evidence-checks', JSON.stringify(checks)); } catch { /* ignore */ }
  }, [checks, ready]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem('evidence-notes', JSON.stringify(notes)); } catch { /* ignore */ }
  }, [notes, ready]);

  const toggle = useCallback((id: string) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const allItems = problem
    ? [...UNIVERSAL_EVIDENCE, ...SPECIFIC_EVIDENCE[problem]]
    : UNIVERSAL_EVIDENCE;

  const checkedCount = allItems.filter((e) => checks[e.id]).length;
  const totalCount = allItems.length;

  const handleExport = () => {
    if (!problem) return;
    const lines = [`【证据清单 — ${PROBLEM_LABELS[problem]}】`, `生成时间：${new Date().toLocaleDateString('zh-CN')}`, ''];
    lines.push('── 通用证据 ──');
    UNIVERSAL_EVIDENCE.forEach((e) => {
      lines.push(`${checks[e.id] ? '✅' : '⬜'} ${e.text}（${e.importance}）${notes[e.id] ? ` — ${notes[e.id]}` : ''}`);
    });
    lines.push('', `── ${PROBLEM_LABELS[problem]}相关证据 ──`);
    SPECIFIC_EVIDENCE[problem].forEach((e) => {
      lines.push(`${checks[e.id] ? '✅' : '⬜'} ${e.text}（${e.importance}）${notes[e.id] ? ` — ${notes[e.id]}` : ''}`);
    });
    lines.push('', `已收集 ${checkedCount}/${totalCount} 项`);
    const text = lines.join('\n');
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-bold text-gray-900">证据收集清单</h1>
      <p className="mt-1 text-sm text-gray-500">
        维权第一步：把证据准备好
      </p>

      {/* 问题类型选择 */}
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-gray-700">你遇到了什么问题？</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PROBLEM_LABELS) as ProblemType[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setProblem(key)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                problem === key
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {PROBLEM_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {!problem && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
          <p className="text-sm text-blue-700">
            先选择你的问题类型，系统会生成对应的证据清单
          </p>
        </div>
      )}

      {problem && (
        <>
          {/* 进度条 */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">收集进度</span>
              <span className="text-gray-500">{checkedCount}/{totalCount} 项</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* 通用证据 */}
          <div className="mt-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">通用证据（所有情况都需要）</h2>
            <div className="space-y-2">
              {UNIVERSAL_EVIDENCE.map((item) => (
                <EvidenceCheckItem
                  key={item.id}
                  item={item}
                  checked={!!checks[item.id]}
                  note={notes[item.id] || ''}
                  onToggle={() => toggle(item.id)}
                  onNoteChange={(v) => setNotes((prev) => ({ ...prev, [item.id]: v }))}
                />
              ))}
            </div>
          </div>

          {/* 专项证据 */}
          <div className="mt-5">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">
              「{PROBLEM_LABELS[problem]}」专项证据
            </h2>
            <div className="space-y-2">
              {SPECIFIC_EVIDENCE[problem].map((item) => (
                <EvidenceCheckItem
                  key={item.id}
                  item={item}
                  checked={!!checks[item.id]}
                  note={notes[item.id] || ''}
                  onToggle={() => toggle(item.id)}
                  onNoteChange={(v) => setNotes((prev) => ({ ...prev, [item.id]: v }))}
                />
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              复制清单
            </button>
            <button
              type="button"
              onClick={() => {
                setChecks({});
                setNotes({});
              }}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              重置
            </button>
          </div>

          {/* 下一步引导 */}
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">证据准备好了</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/guide"
                className="rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                查看维权路径
              </Link>
              <Link
                href="/legal-aid"
                className="rounded-lg border border-blue-300 bg-white px-3 py-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                找法援入口
              </Link>
            </div>
          </div>
        </>
      )}

      <p className="mt-4 text-center text-xs text-gray-500">
        清单数据保存在本地浏览器，不会上传。建议收集完后复制清单备份。
      </p>
    </div>
  );
}

function EvidenceCheckItem({
  item,
  checked,
  note,
  onToggle,
  onNoteChange,
}: {
  item: EvidenceItem;
  checked: boolean;
  note: string;
  onToggle: () => void;
  onNoteChange: (v: string) => void;
}) {
  const [showNote, setShowNote] = useState(false);
  const importanceClass =
    item.importance === '必须'
      ? 'bg-red-100 text-red-700'
      : item.importance === '建议'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-gray-100 text-gray-500';

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        checked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
      }`}
    >
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${checked ? 'text-green-800 line-through' : 'text-gray-900'}`}>
              {item.text}
            </span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${importanceClass}`}>
              {item.importance}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">{item.how}</p>
        </div>
      </label>
      <button
        type="button"
        onClick={() => setShowNote(!showNote)}
        className="mt-1.5 ml-6.5 text-xs text-blue-600 hover:underline"
      >
        {showNote ? '收起备注' : '添加备注'}
      </button>
      {showNote && (
        <input
          type="text"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="备注：如拍摄日期、存放位置等"
          className="mt-1 ml-6.5 w-[calc(100%-1.625rem)] rounded border border-gray-200 px-2 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
        />
      )}
    </div>
  );
}
