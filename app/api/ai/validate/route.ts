import { NextResponse } from 'next/server';
import { validateNeedWithAI } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const analysis = await validateNeedWithAI(title, description);

    if (!analysis) {
      return NextResponse.json({ error: 'AI Analysis failed' }, { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
