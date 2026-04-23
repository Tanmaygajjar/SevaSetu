import { NextResponse } from 'next/server';
import { generateImpactNarrative } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const { stats, ngoName } = await request.json();
    const result = await generateImpactNarrative(stats, ngoName);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
