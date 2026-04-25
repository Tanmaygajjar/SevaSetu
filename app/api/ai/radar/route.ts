import { NextResponse } from 'next/server';
import { getRadarInsights } from '@/lib/ai/gemini';

export async function POST(req: Request) {
  try {
    const { needs } = await req.json();
    
    if (!needs || !Array.isArray(needs) || needs.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty needs data' }, { status: 400 });
    }

    console.log('AI Radar API: Processing', needs.length, 'needs');
    const insights = await getRadarInsights(needs);
    
    if (!insights || !insights.hotspot) {
      console.error('AI Radar API: getRadarInsights returned invalid data:', insights);
      return NextResponse.json({ error: 'Failed to generate valid insights' }, { status: 500 });
    }

    return NextResponse.json(insights);
  } catch (error: any) {
    console.error('API Radar Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate radar insights' }, { status: 500 });
  }
}
