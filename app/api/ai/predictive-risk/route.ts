import { NextResponse } from 'next/server';
import { predictCascadingRisks } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const { needs, weather } = await request.json();
    const risks = await predictCascadingRisks(needs || [], weather || { temp: 32, humidity: 80, forecast: "Heavy Rain" });
    return NextResponse.json(risks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
