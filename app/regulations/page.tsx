import type { Metadata } from 'next';
import RegulationsClient from './RegulationsClient';

export const metadata: Metadata = {
  title: '法规政策',
  description: '外卖骑手劳动权益相关法规政策摘要，涵盖劳动关系、劳动报酬、工伤、法律援助等领域。',
};

export default function RegulationsPage() {
  return <RegulationsClient />;
}
