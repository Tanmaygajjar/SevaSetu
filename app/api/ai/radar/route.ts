import { NextResponse } from 'next/server';
import { getRadarInsights } from '@/lib/ai/gemini';

export async function POST(req: Request) {
  try {
    const { needs } = await req.json();
    
    if (!needs || !Array.isArray(needs)) {
      return NextResponse.json({ error: 'Invalid needs data' }, { status: 400 });
    }

    const insights = await getRadarInsights(needs);
    return NextResponse.json(insights);
  } catch (error) {
    console.error('API Radar Error:', error);
    return NextResponse.json({ error: 'Failed to generate radar insights' }, { status: 500 });
  }
}
