import type { Metadata, Viewport } from 'next';
import BottomNav from '@/components/BottomNav';
import DesktopNav from '@/components/DesktopNav';
import Providers from '@/components/Providers';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://delivery-helper.vercel.app'),
  title: '骑手权益助手 — 外卖骑手劳动权益保障平台',
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
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/icons/icon-32x32.png" type="image/png" />
        <link rel="icon" href="/icons/icon-96x96.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Providers>
          <DesktopNav />
          <main className="mx-auto max-w-lg pb-20 md:max-w-6xl md:px-6 md:pb-10">
            {children}
          </main>
          <BottomNav />
        </Providers>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
