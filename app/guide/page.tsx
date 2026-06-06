import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '维权路径指引',
  description: '遇到劳动纠纷不知道怎么办？五步维权路径：收集证据→平台沟通→调解→监察投诉→仲裁诉讼',
};

const steps = [
  {
    id: 1,
    title: '收集证据',
    icon: '📋',
    description: '不管走哪条路，先把手里的证据整理好。',
    items: [
      '平台 app 里的订单记录、收入明细、扣款通知',
      '与站长或平台的聊天记录（微信、钉钉截图）',
      '平台协议、用工合同（如有）',
      '银行流水（体现收入和扣款）',
      '受伤的话：事故照片、医院诊断、费用票据',
    ],
  },
  {
    id: 2,
    title: '先跟平台沟通',
    icon: '💬',
    description: '很多纠纷在这一步就能解决，成本最低。',
    items: [
      '在骑手 app 内提交申诉或反馈',
      '拨打平台客服热线，记录工单号',
      '要求平台给出书面回复或处理结果',
      '如果平台不回复或结果不满意，进入下一步',
    ],
  },
  {
    id: 3,
    title: '申请调解',
    icon: '🤝',
    description: '找第三方帮忙协调，不花钱，速度快。',
    items: [
      '联系当地新就业形态劳动纠纷调解中心',
      '拨打 12333（人社服务热线）咨询调解渠道',
      '工会组织也可以帮忙调解',
      '调解达成协议后双方签字，具有约束力',
    ],
  },
  {
    id: 4,
    title: '劳动监察投诉',
    icon: '📝',
    description: '向政府部门举报平台违规行为。',
    items: [
      '去当地劳动保障监察大队窗口投诉',
      '或拨打 12333 电话投诉',
      '或通过"全国根治欠薪线索反映平台"线上提交',
      '监察部门会调查并责令平台改正',
    ],
  },
  {
    id: 5,
    title: '仲裁或诉讼',
    icon: '⚖️',
    description: '法律途径，适合金额较大或平台拒不配合的情况。',
    items: [
      '向当地劳动人事争议仲裁委员会申请仲裁',
      '仲裁一般免费，时效为知道权利被侵害之日起一年内',
      '对仲裁结果不服，可以向法院起诉',
      '经济困难可申请法律援助（拨打 12348）',
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-bold text-gray-900">维权路径指引</h1>
      <p className="mt-1 text-sm text-gray-500">
        遇到劳动纠纷不知道怎么办？按这五步走
      </p>

      {/* 快速通道 */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href="tel:12333"
          aria-label="拨打人社服务热线 12333"
          className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center"
        >
          <p className="text-lg font-bold text-blue-900">12333</p>
          <p className="text-xs text-blue-600">人社服务热线</p>
        </a>
        <Link
          href="/legal-aid"
          className="rounded-xl border border-green-200 bg-green-50 p-3 text-center"
        >
          <p className="text-lg font-bold text-green-900">12348</p>
          <p className="text-xs text-green-600">法律援助热线</p>
        </Link>
      </div>

      {/* 五步流程 */}
      <div className="mt-5 space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">{step.icon}</span>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  第{step.id}步
                </p>
                <h2 className="text-base font-bold text-gray-900">
                  {step.title}
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {step.description}
            </p>
            <ul className="mt-2 space-y-1">
              {step.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 重要提醒 */}
      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="text-sm font-semibold text-amber-900">几点提醒</h2>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-amber-800">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
            每一步都记得留好证据（截图、录音、书面材料）
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
            仲裁时效是一年，从你知道权利被侵害之日起算
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
            平台不能以"你是外包/众包"为由拒绝承担责任
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
            经济困难可以申请免费法律援助（12348 按 2 转法援查询）
          </li>
        </ul>
      </div>

      {/* 工具入口 */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <Link
          href="/evidence"
          className="rounded-xl bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
        >
          准备证据
        </Link>
        <Link
          href="/calculator"
          className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          算时薪
        </Link>
        <Link
          href="/chat"
          className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          问 AI
        </Link>
      </div>

      {/* 来源说明 */}
      <p className="mt-4 text-center text-xs text-gray-500">
        维权流程参考中工网、人社部和 12348 法网公开信息，仅供参考，具体以当地政策为准。
      </p>
    </div>
  );
}
