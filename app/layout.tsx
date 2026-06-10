import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import BottomNav from '@/components/BottomNav';
import DesktopNav from '@/components/DesktopNav';
import AxeDevTools from '@/components/AxeDevTools';
import NativeBridge from '@/components/NativeBridge';
import OfflineDataNotice from '@/components/OfflineDataNotice';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import InstallPrompt from '@/components/InstallPrompt';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '骑手权益助手',
  url: SITE_URL,
  description: '面向外卖骑手的工时薪资测算、法规查询、法援导航和AI权益信息问答平台',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+86-12348',
    contactType: 'legal aid hotline',
    availableLanguage: 'Chinese',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '外卖骑手的工资低于最低工资怎么办？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '先用薪资计算器算出你的时薪，对比当地最低工资参考线。如果低于参考线，建议收集收入流水、在线时长等证据，拨打12333咨询或申请法律援助（12348）。注意：骑手是否适用最低工资取决于劳动关系认定。',
      },
    },
    {
      '@type': 'Question',
      name: '骑手送餐受伤算工伤吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '如果与平台或配送公司存在劳动关系，送餐途中受伤可申请工伤认定。如果是众包骑手，可依据新就业形态职业伤害保障试点政策申请。关键是保留事故现场照片、医院诊断证明和当时送单记录。',
      },
    },
    {
      '@type': 'Question',
      name: '骑手被平台扣款怎么维权？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '先保存扣款通知截图和相关订单详情，在app内提交申诉。如果平台不处理或结果不满意，可拨打12333投诉或向劳动监察部门举报。金额较大时可申请劳动仲裁。',
      },
    },
    {
      '@type': 'Question',
      name: '骑手没签劳动合同怎么证明劳动关系？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '可从三个维度收集证据：身份从属性（工服、工牌、统一装备）、经济从属性（工资流水、扣款记录）、组织从属性（排班表、派单记录、处罚通知）。这些都能证明事实劳动关系。',
      },
    },
    {
      '@type': 'Question',
      name: '骑手被封号了怎么办？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '先截图保存封号通知和原因说明，在app内提交申诉。如果平台拒绝解封或理由不合理，可向劳动监察部门投诉，因为封号实质上等同于解除劳动关系或终止用工。',
      },
    },
    {
      '@type': 'Question',
      name: '骑手遇到劳动纠纷怎么在线申请调解？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '2026年5月起，人社部"劳动人事争议在线调解服务平台"全国上线。三种入口：访问tiaojie.12333.gov.cn、微信/支付宝搜"电子社保卡"找调解入口、拨打12333热线。全程免费，支持跨省异地维权，调解协议可司法确认具有强制执行力。',
      },
    },
    {
      '@type': 'Question',
      name: '外卖骑手送餐受伤有什么保障？职业伤害保障怎么申请？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '2026年7月1日起职业伤害保障全国31省推行，覆盖外卖、出行、货运三大行业。平台按单缴费（配送每单0.07至0.25元），骑手无需缴费。受伤后通过平台APP"职业伤害"入口申请，待遇涵盖医疗费用、伤残补助、死亡抚恤。新职伤与商业意外险可双重理赔。如有疑问拨打12333。',
      },
    },
    {
      '@type': 'Question',
      name: '超过退休年龄的骑手有什么权益保障？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '人社部56号令《超龄劳动者基本权益保障暂行规定》2026年7月1日施行。超法定退休年龄的骑手享有：报酬不低于当地最低工资标准、工伤保险、合理工时和休息、职业安全健康保障。用人单位须签订书面协议，争议适用《劳动争议调解仲裁法》。拨打12333投诉或12348申请法律援助。',
      },
    },
    {
      '@type': 'Question',
      name: '外卖骑手可以在工作城市缴社保吗？户籍限制取消了吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '可以。2026年3月1日起全国全面放开灵活就业人员就业地参保户籍限制（国发〔2026〕11号），凭身份证、居住证或就业证明即可在工作地直接参加职工社保，不再受户籍限制。京东全额承担五险一金，美团饿了么补贴灵活就业养老保险50%，政府另补10%。',
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '骑手权益助手',
    template: '%s - 骑手权益助手',
  },
  description: '面向外卖骑手的工时薪资测算、法规查询、法援导航和 AI 权益信息问答平台，帮助骑手了解自己的劳动权益。',
  keywords: ['外卖骑手', '劳动权益', '工资计算', '法律援助', '最低工资', '骑手保障', '职业伤害保障', '在线调解', '劳动纠纷', '超龄劳动者', '灵活就业社保', '户籍限制取消'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '骑手权益',
  },
  openGraph: {
    title: '骑手权益助手',
    description: '面向外卖骑手的工时薪资测算、法规查询、法援导航和 AI 权益信息问答平台',
    type: 'website',
    locale: 'zh_CN',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b7a3b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={GeistSans.variable}>
      <head>
        <link rel="icon" href="/icons/icon-32x32.png" type="image/png" />
        <link rel="icon" href="/icons/icon-96x96.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        {/* 百度/国内浏览器兼容：强制使用 webkit 内核渲染 */}
        <meta name="renderer" content="webkit" />
        <meta name="force-rendering" content="webkit" />
        <meta name="applicable-device" content="pc,mobile" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#fffdf7] text-[#111827] antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#0b7a3b] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          跳转至主内容
        </a>
        <AxeDevTools />
        <NativeBridge />
        <DesktopNav />
        <OfflineDataNotice />
        <main id="main-content" className="mx-auto w-full max-w-lg pb-20 md:max-w-[1440px] md:px-12 md:pb-10">
          {children}
        </main>
        <footer className="mx-auto max-w-lg px-4 py-4 text-center text-xs text-[#667085] md:max-w-[1440px] md:px-12 md:py-6">
          <div className="flex justify-center gap-4">
            <a href="/privacy" className="underline underline-offset-2 hover:text-gray-700">隐私说明</a>
            <a href="/disclaimer" className="underline underline-offset-2 hover:text-gray-700">免责声明</a>
            <a href="tel:12348" aria-label="拨打法律援助热线 12348" className="hover:text-gray-700">12348</a>
          </div>
          <p className="mt-2">信息仅供参考，不构成法律意见</p>
        </footer>
        <BottomNav />
        <ServiceWorkerRegistrar />
        <InstallPrompt />
      </body>
    </html>
  );
}
