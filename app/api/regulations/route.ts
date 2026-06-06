import { regulations } from '@/data/regulations';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const keyword = searchParams.get('keyword');

  let result = regulations;

  if (category) {
    result = result.filter((r) => r.category === category);
  }

  if (keyword) {
    const lower = keyword.toLowerCase();
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        r.summary.toLowerCase().includes(lower) ||
        r.tags.some((t) => t.toLowerCase().includes(lower))
    );
  }

  return NextResponse.json({
    data: result,
    total: result.length,
  });
}
