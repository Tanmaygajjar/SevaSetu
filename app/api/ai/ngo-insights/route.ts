import { NextResponse } from 'next/server';
import { model } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const { needs } = await request.json();
    
    const prompt = `
      You are the Strategic Analyst for Resource IQ NGO Command Center.
      Today's reported needs: ${needs.length > 0 ? needs.map((n: any) => `${n.title} (Urgency: ${n.urgency_score})`).join("; ") : "No new needs reported today."}

      Provide a high-level strategic summary (2 sentences max) of the current situation.
      If there are needs, pick the top 3 to focus on. If not, suggest maintenance tasks.
      
      Return ONLY a JSON object with:
      - summary (string)
      - priorities (array of { title: string, reason: string })

      DO NOT include markdown formatting or any text outside the JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(jsonStr));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
