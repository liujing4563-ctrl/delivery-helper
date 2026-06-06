import type { Metadata } from 'next';
import EvidenceClient from './EvidenceClient';

export const metadata: Metadata = {
  title: '证据收集清单',
  description: '按问题类型整理维权证据清单，支持打印导出。覆盖扣款、工伤、封号、劳动关系、低薪五类问题。',
};

export default function EvidencePage() {
  return <EvidenceClient />;
}
