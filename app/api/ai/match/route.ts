import { NextResponse } from 'next/server';
import { model } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const { volunteerSkills, needs } = await request.json();
    
    const prompt = `
      You are the Smart Coordinator for Resource IQ.
      Volunteer Skills: ${volunteerSkills.join(", ")}
      Available Needs: ${needs.map((n: any) => `${n.id}: ${n.title} (${n.category})`).join("; ")}

      Rank the top 3 needs that best match the volunteer's skills.
      Return ONLY a JSON array of task IDs in priority order.
      Example: ["need-1", "need-5", "need-2"]
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
