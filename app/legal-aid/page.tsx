import type { Metadata } from 'next';
import LegalAidClient from './LegalAidClient';

export const metadata: Metadata = {
  title: '法律援助目录',
  description: '全国法律援助中心地址、电话查询，12348热线指引，正规律所查询入口。',
};

export default function LegalAidPage() {
  return <LegalAidClient />;
}
