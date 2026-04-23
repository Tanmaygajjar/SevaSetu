import { NextResponse } from 'next/server';
import { forecastResourceNeeds } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const { history, trend } = await request.json();
    const result = await forecastResourceNeeds(history || [], trend || "Normal Operation");
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
