import Link from 'next/link';
import DisclaimerBox from '@/components/DisclaimerBox';
import FeatureCard from '@/components/FeatureCard';
import ProblemCard from '@/components/ProblemCard';
import type { FeatureEntry, ProblemEntry } from '@/data/types';

const problems: ProblemEntry[] = [
  {
    id: 'deduction',
    title: '被扣钱',
    description: '先整理扣款通知、订单记录和平台规则',
    icon: '扣',
    href: '/chat?topic=deduction',
  },
  {
    id: 'low-pay',
    title: '工资太低',
    description: '用计算器测算时薪和最低工资参考线',
    icon: '薪',
    href: '/calculator',
  },
  {
    id: 'injury',
    title: '送餐受伤',
    description: '记录事故经过、医疗票据和平台沟通',
    icon: '伤',
    href: '/chat?topic=injury',
  },
  {
    id: 'blocked',
    title: '被封号',
    description: '查看退出、申诉和平台规则公示线索',
    icon: '号',
    href: '/chat?topic=blocked',
  },
  {
    id: 'contract',
    title: '没签合同',
    description: '梳理劳动关系或新就业形态用工关系',
    icon: '约',
    href: '/chat?topic=contract',
  },
  {
    id: 'legal-aid',
    title: '想申请法援',
    description: '查 12348 和当地法律援助中心入口',
    icon: '援',
    href: '/legal-aid',
  },
];

const features: FeatureEntry[] = [
  {
    id: 'calculator',
    title: '薪资测算',
    description: '输入订单、收入、扣款和工时，测算净收入与时薪',
    icon: '算',
    href: '/calculator',
  },
  {
    id: 'regulations',
    title: '法规与政策库',
    description: '查看劳动报酬、平台规则、法援等官方来源摘要',
    icon: '规',
    href: '/regulations',
  },
  {
    id: 'legal-aid',
    title: '法律援助目录',
    description: '按城市查找法援中心和正规律所查询入口',
    icon: '助',
    href: '/legal-aid',
  },
  {
    id: 'chat',
    title: 'AI 权益信息助手',
    description: '按证据清单、规则来源和下一步路径梳理问题',
    icon: '问',
    href: '/chat',
  },
  {
    id: 'news',
    title: '权益动态',
    description: '查看外卖骑手相关的最新政策、法规和行业资讯',
    icon: '新',
    href: '/news',
  },
];

export default function Home() {
  return (
    <div className="pb-4 md:pb-8">
      <section className="bg-blue-700 px-4 pb-5 pt-6 text-white md:mt-6 md:rounded-2xl md:px-8 md:py-8">
        <p className="text-sm font-medium text-blue-100">
          外卖骑手劳动权益信息平台
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-8 md:max-w-2xl md:text-4xl md:leading-tight">
          先算清时薪，再找到合适的咨询路径
        </h1>
        <p className="mt-3 text-sm leading-6 text-blue-50 md:max-w-2xl md:text-base">
          本站提供薪资测算、法规摘要、法援导航和权益信息问答。内容只作信息参考，不替代律师意见。
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 md:max-w-sm">
          <Link
            href="/calculator"
            className="rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-blue-700"
          >
            先算时薪
          </Link>
          <Link
            href="/legal-aid"
            className="rounded-lg border border-blue-200 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            找法援入口
          </Link>
        </div>
      </section>

      <section className="px-4 pt-5 md:px-0 md:pt-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              你遇到了什么问题
            </h2>
            <p className="mt-1 text-sm text-gray-500">按问题进入对应工具或引导页</p>
          </div>
          <Link href="/chat" className="shrink-0 text-sm font-medium text-blue-600">
            问助手
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      </section>

      <section className="px-4 pt-6 md:px-0 md:pt-8">
        <h2 className="text-lg font-bold text-gray-900">常用工具</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>

      <section className="px-4 pt-6 md:px-0 md:pt-8">
        <DisclaimerBox />
        <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500">
          <Link href="/privacy" className="underline underline-offset-2">
            隐私说明
          </Link>
          <Link href="/disclaimer" className="underline underline-offset-2">
            免责声明
          </Link>
        </div>
      </section>
    </div>
  );
}
