import { NextResponse } from 'next/server';
import { model } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const { volunteers, activeNeeds } = await request.json();
    
    const prompt = `
      You are the AI Talent Scout for Sahaayak NGO.
      
      Current Volunteer Pool:
      ${volunteers.map((v: any) => `- ${v.name}: Skills: ${v.skills.join(", ")}, Rating: ${v.rating}, Status: ${v.status}`).join("\n")}
      
      Top Active Needs:
      ${activeNeeds.map((n: any) => `- ${n.title} (Category: ${n.category}, Urgency: ${n.urgency_score})`).join("\n")}

      Tasks:
      1. Provide a "Deployment Strategy" (2 sentences max) based on the current workforce.
      2. Identify "Top Talent Matches" - which volunteers should be sent to which needs immediately.
      3. Identify "Skill Gaps" - what skills are we missing to solve the current needs.

      Return ONLY a JSON object with:
      - strategy (string)
      - matches (array of { volunteerName: string, needTitle: string, reason: string })
      - gaps (array of string)

      DO NOT include markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(jsonStr));
  } catch (error: any) {
    console.error("Volunteer Scout AI Error:", error);
    return NextResponse.json({ 
        strategy: "Maintain current deployment protocol. Workforce synchronization in progress.",
        matches: [],
        gaps: ["No critical gaps identified"]
    });
  }
}
