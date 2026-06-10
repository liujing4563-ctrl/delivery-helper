import type { Metadata } from 'next';
import CalculatorForm from '@/components/CalculatorForm';

export const metadata: Metadata = {
  title: '薪资计算器',
  description: '算算你的时薪，对比当地最低工资参考线，了解你的收入是否达标',
};

const calcHowToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '外卖骑手如何计算时薪并对比最低工资',
  description: '三步计算你的实际时薪，与当地最低工资标准对比，判断收入是否达标。',
  step: [
    {
      '@type': 'HowToStep',
      name: '收集收入数据',
      text: '记录你一个月的总收入（含基础配送费、补贴、奖励，扣除罚款后的实际到手金额）和在线总时长（从上线到下线的全部时间）。',
    },
    {
      '@type': 'HowToStep',
      name: '计算时薪',
      text: '用月总收入除以月在线总时长，得到实际时薪。例如月入6000元、在线240小时，时薪为25元。',
    },
    {
      '@type': 'HowToStep',
      name: '对比最低工资',
      text: '查询当地小时最低工资标准，将你的时薪与之对比。如果低于最低工资，可拨打12333咨询或12348申请法律援助。',
    },
  ],
};

const calcFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '外卖骑手适用最低工资标准吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '如果与平台或配送公司存在劳动关系，骑手适用当地最低工资标准。众包/灵活用工骑手是否适用最低工资存在争议，但2026年多地明确要求平台保障骑手收入不低于最低工资。',
      },
    },
    {
      '@type': 'Question',
      name: '骑手时薪怎么算？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '时薪 = 月实际到手收入 ÷ 月在线总时长。注意：在线时长包括等单时间，不只是配送时间。收入应包含所有补贴和奖励，扣除罚款后的净额。',
      },
    },
    {
      '@type': 'Question',
      name: '时薪低于最低工资怎么办？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '先保存收入流水和在线时长截图作为证据，拨打12333人社热线投诉，或拨打12348申请免费法律援助。也可以向劳动监察部门举报平台违规行为。',
      },
    },
  ],
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-[1320px] py-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calcHowToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calcFaqJsonLd) }}
      />
      <h1 className="text-4xl font-black tracking-normal text-[#111827]">薪资测算工具</h1>
      <p className="mt-4 text-base text-[#344054]">
        输入订单收入、补贴、扣款及在线时长，帮您计算真实时薪，并与当地最低工资参考进行对比。
      </p>

      <div className="mt-7">
        <CalculatorForm />
      </div>
    </div>
  );
}
