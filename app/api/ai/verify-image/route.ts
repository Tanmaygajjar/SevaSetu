import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Image data missing" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract base64 data and mime type
    const match = imageBase64.match(/^data:(image\/[a-z]+);base64,(.+)$/);
    if (!match) {
        return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    const mimeType = match[1];
    const data = match[2];

    const prompt = `Analyze this image for a civic incident reporting platform (SevaSetu). 
    Determine if this is a REAL, AUTHENTIC photograph of a civic issue, emergency, or social need (e.g., potholes, accidents, elderly people needing help, medical issues, fire, flood, etc.).
    Reject images that are:
    1. Screenshots of other apps/websites.
    2. Artificial/Generated art or cartoons.
    3. Obviously fake or irrelevant (e.g., a selfie in a room with no context).
    4. Explicit or inappropriate.

    Return JSON: 
    {
      "valid": boolean,
      "description": "short description of what is seen",
      "confidence": number (0-1),
      "reason": "reason for rejection if valid is false"
    }`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data,
          mimeType,
        },
      },
    ]);

    const text = result.response.text();
    // Clean JSON if needed (sometimes Gemini wraps in ```json)
    const jsonString = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(jsonString);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Image verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
