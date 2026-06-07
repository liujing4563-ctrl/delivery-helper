'use cache';

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
    description: '找第三方帮忙协调，不花钱，速度快，2026 年起全国在线可办。',
    items: [
      '人社部"在线调解平台"：tiaojie.12333.gov.cn，全国通用，支持跨省异地维权',
      '微信/支付宝搜"电子社保卡" → 劳动人事争议调解申请',
      '拨打 12333（人社热线）也可线上申请调解，客服会指导操作',
      '调解协议可申请司法确认，具有强制执行力',
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

const guideFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '申请劳动仲裁需要准备什么材料？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '需要准备：仲裁申请书（一式两份）、身份证复印件、劳动关系证明（合同/工牌/工资流水/社保记录/平台接单记录）、支持主张的证据。向劳动合同履行地或单位所在地的劳动争议仲裁委员会提交。仲裁免费，受理后45日内裁决。',
      },
    },
    {
      '@type': 'Question',
      name: '骑手没有劳动合同怎么证明劳动关系？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '平台接单记录、APP截图、与站长聊天记录、统一工服照片、工资银行流水都可以作为事实劳动关系的证据。最高法指导性案例238号确立了"支配性劳动管理"标准。',
      },
    },
    {
      '@type': 'Question',
      name: '外卖骑手怎么加入工会？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '拨打12351工会服务热线查询当地入会渠道。三种方式：单位已建工会直接向单位工会申请；单位未建工会加入街道/社区工会；部分地区支持线上申请。工会有权代表骑手与平台协商劳动条件、参与调解纠纷。',
      },
    },
  ],
};

export default async function GuidePage() {
  return (
    <div className="px-4 pt-6 pb-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideFaqJsonLd) }}
      />
      <h1 className="text-xl font-bold text-gray-900">维权路径指引</h1>
      <p className="mt-1 text-sm text-gray-500">
        遇到劳动纠纷不知道怎么办？按这五步走
      </p>

      {/* 快速通道 */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <a
          href="tel:12333"
          aria-label="拨打人社服务热线 12333"
          className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center"
        >
          <p className="text-lg font-bold text-blue-900">12333</p>
          <p className="text-xs text-blue-600">人社热线</p>
        </a>
        <Link
          href="/legal-aid"
          aria-label="查看法律援助信息和 12348 热线"
          className="rounded-xl border border-green-200 bg-green-50 p-3 text-center"
        >
          <p className="text-lg font-bold text-green-900">12348 →</p>
          <p className="text-xs text-green-600">法律援助</p>
        </Link>
        <a
          href="tel:12351"
          aria-label="拨打工会服务热线 12351"
          className="rounded-xl border border-purple-200 bg-purple-50 p-3 text-center"
        >
          <p className="text-lg font-bold text-purple-900">12351</p>
          <p className="text-xs text-purple-600">工会热线</p>
        </a>
      </div>
      <a
        href="http://tiaojie.12333.gov.cn/portal/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block rounded-xl border border-orange-200 bg-orange-50 p-3 text-center"
      >
        <p className="text-sm font-bold text-orange-900">在线申请劳动调解</p>
        <p className="text-xs text-orange-600">人社部官方调解平台 · 免费 · 全国通用 · 跨省可办</p>
      </a>
      <p className="mt-1 text-center text-xs text-gray-500">
        三种入口：网站申请 · 微信/支付宝搜"电子社保卡" → 劳动调解 · 拨打{' '}
        <a href="tel:12333" className="text-blue-600 underline" aria-label="拨打 12333">12333</a>
      </p>

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

      {/* 平台申诉实操 */}
      <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-4">
        <h2 className="text-sm font-semibold text-teal-900">各平台申诉入口和技巧</h2>
        <div className="mt-2 space-y-2 text-sm text-teal-800">
          <p>
            <strong>美团骑手：</strong>骑手 APP → 我的 → 申诉中心。超时、取消等异常场景可"一键举证"，非骑手原因（暴雨、高温、商家出餐慢等）可报备免责。申诉时务必截图保存平台回复。
          </p>
          <p>
            <strong>饿了么/蜂鸟众包：</strong>骑手 APP → 消息中心 → 申诉。注意：部分类型仅允许一次申诉机会，提交前确保材料齐全。
          </p>
          <p>
            <strong>通用建议：</strong>每次申诉都截图保存工单号和平台回复。如果 APP 内申诉被驳回或超时未回复，可进入下一步正式渠道。
          </p>
        </div>
      </div>

      {/* 外部投诉渠道 */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">平台内部解决不了？试试外部渠道</h2>
        <div className="mt-2 space-y-2 text-sm text-gray-700">
          <p>
            <a href="https://tousu.sina.cn/" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline" aria-label="访问黑猫投诉平台">
              黑猫投诉
            </a>（新浪旗下消费投诉平台）：骑手被不合理扣款、封号等问题可在线提交投诉，平台通常 72 小时内回复。
          </p>
          <p>
            <strong>12345 市民热线：</strong>拨打 <a href="tel:12345" className="text-blue-600 underline" aria-label="拨打 12345 市民热线">12345</a>，可转接劳动监察部门。投诉后政府部门会跟进处理。
          </p>
        </div>
      </div>

      {/* 仲裁详细流程 */}
      <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <h2 className="text-sm font-semibold text-blue-900">申请仲裁，你需要准备什么？</h2>
        <div className="mt-2 space-y-2 text-sm text-blue-800">
          <p>
            <strong>材料清单：</strong>仲裁申请书（一式两份）、身份证复印件、劳动关系证明（合同/工牌/工资流水/社保记录/平台接单记录）、支持你主张的证据。
          </p>
          <p>
            <strong>提交地点：</strong>劳动合同履行地或单位所在地的劳动争议仲裁委员会。
          </p>
          <p>
            <strong>时间线：</strong>提交后 5 日内决定是否受理 → 受理后 45 日内裁决 → 不服可 15 日内向法院起诉。仲裁免费。
          </p>
          <p>
            <strong>骑手特别注意：</strong>即使没有劳动合同，平台接单记录、APP 截图、与站长聊天记录、统一工服照片都可以作为事实劳动关系的证据。
          </p>
        </div>
      </div>

      {/* 工会入会指引 */}
      <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 p-4">
        <h2 className="text-sm font-semibold text-purple-900">加入工会，多一层保护</h2>
        <div className="mt-2 space-y-2 text-sm text-purple-800">
          <p>
            工会有权代表骑手与平台协商劳动条件、参与调解纠纷、提供法律援助。拨打{' '}
            <a href="tel:12351" className="font-bold underline" aria-label="拨打工会服务热线 12351">
              12351
            </a>{' '}
            查询当地工会入会渠道。
          </p>
          <p>
            <strong>三种入会方式：</strong>单位已建工会 → 直接向单位工会申请；单位未建工会 → 加入工作所在地的街道/社区工会；部分地区支持线上申请入会。
          </p>
        </div>
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
