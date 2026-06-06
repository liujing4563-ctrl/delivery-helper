import type { Metadata } from 'next';
import ChatClient from './ChatClient';

export const metadata: Metadata = {
  title: 'AI 权益助手',
  description: '外卖骑手劳动权益 AI 信息助手，基于法规数据回答扣款、工伤、劳动关系等问题。',
};

export default function ChatPage() {
  return <ChatClient />;
}
