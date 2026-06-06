import { newsItems } from '@/data/news';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: newsItems,
    total: newsItems.length,
  });
}
