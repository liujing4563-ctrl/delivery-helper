import { legalAidCenters } from '@/data/legalAidCenters';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  let result = legalAidCenters;

  if (city) {
    result = result.filter((c) => c.city === city);
  }

  return NextResponse.json({
    data: result,
    total: result.length,
  });
}
