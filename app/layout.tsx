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
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '骑手权益助手',
    template: '%s - 骑手权益助手',
  },
  description: '面向外卖骑手的工时薪资测算、法规查询、法援导航和 AI 权益信息问答平台，帮助骑手了解自己的劳动权益。',
  keywords: ['外卖骑手', '劳动权益', '工资计算', '法律援助', '最低工资', '骑手保障'],
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
  themeColor: '#2563eb',
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
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          跳转至主内容
        </a>
        <AxeDevTools />
        <NativeBridge />
        <DesktopNav />
        <OfflineDataNotice />
        <main id="main-content" className="mx-auto max-w-lg pb-20 md:max-w-6xl md:px-6 md:pb-10">
          {children}
        </main>
        <footer className="mx-auto max-w-lg px-4 py-4 text-center text-xs text-gray-500 md:max-w-6xl md:px-6 md:py-6">
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
