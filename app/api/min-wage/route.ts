import { minWageData } from '@/data/minWage';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: minWageData,
    total: minWageData.length,
  });
}
