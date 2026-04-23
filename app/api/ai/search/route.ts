import { NextResponse } from 'next/server';
import { model } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const { query, categories } = await request.json();
    
    const prompt = `
      You are the AI Search engine for SevaSetu, a civic platform.
      The user typed: "${query}"
      Available categories: ${categories.join(", ")}

      Convert this search into a structured filter.
      Return ONLY a JSON object with:
      - city (string or null)
      - category (string from available categories or null)
      - min_urgency (number 0-10 or null)
      - is_urgent (boolean)

      Example: "urgent food in rajkot" -> { "city": "Rajkot", "category": "food", "min_urgency": 7, "is_urgent": true }
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
