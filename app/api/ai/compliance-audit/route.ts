import { NextResponse } from 'next/server';
import { auditEntityCompliance } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const { ngoData, docs } = await request.json();
    const result = await auditEntityCompliance(ngoData, docs || []);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
