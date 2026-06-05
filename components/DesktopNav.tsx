'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/data/types';

type DesktopNavItem = Pick<NavItem, 'label' | 'href'>;

const navItems: DesktopNavItem[] = [
  { label: '首页', href: '/' },
  { label: '薪资测算', href: '/calculator' },
  { label: '法规库', href: '/regulations' },
  { label: '法援目录', href: '/legal-aid' },
  { label: 'AI 助手', href: '/chat' },
  { label: '权益动态', href: '/news' },
];

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="桌面主导航"
      className="sticky top-0 z-40 hidden border-b border-gray-200 bg-white/95 backdrop-blur md:block"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white"
          >
            骑
          </span>
          <div>
            <p className="text-sm font-bold text-gray-900">骑手权益助手</p>
            <p className="text-xs text-gray-500">劳动权益信息平台</p>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
