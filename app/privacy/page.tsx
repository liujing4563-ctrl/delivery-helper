import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: '隐私说明',
  description: '骑手权益助手隐私政策说明，了解本站如何收集和使用你的信息。',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
