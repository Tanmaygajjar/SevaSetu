import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ valid: true, description: "No image data provided", confidence: 0 });
    }

    // If no Gemini API key, auto-approve
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY missing - auto-approving image");
      return NextResponse.json({ valid: true, description: "Image accepted (AI verification unavailable)", confidence: 0.5 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract base64 data and mime type - more flexible regex
    const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      // If format doesn't match, still allow submission
      console.warn("Image format doesn't match expected base64 pattern, auto-approving");
      return NextResponse.json({ valid: true, description: "Image accepted (format bypass)", confidence: 0.5 });
    }
    const mimeType = match[1];
    const data = match[2];

    const prompt = `Analyze this image for a civic incident reporting platform (Resource IQ). 
    Determine if this is a REAL, AUTHENTIC photograph of a civic issue, emergency, or social need (e.g., potholes, accidents, elderly people needing help, medical issues, fire, flood, etc.).
    Reject images that are:
    1. Screenshots of other apps/websites.
    2. Artificial/Generated art or cartoons.
    3. Obviously fake or irrelevant (e.g., a selfie in a room with no context).
    4. Explicit or inappropriate.

    Be LENIENT - if the image could reasonably be related to a civic need, approve it.

    Return ONLY a JSON object (no markdown, no code blocks):
    {
      "valid": true or false,
      "description": "short description of what is seen",
      "confidence": number between 0 and 1,
      "reason": "reason for rejection if valid is false, empty string if valid"
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
    console.log("Image verification raw response:", text.substring(0, 300));
    
    // Robust JSON extraction
    let analysis;
    try {
      // Try direct parse
      analysis = JSON.parse(text.trim());
    } catch {
      // Remove markdown blocks
      const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      try {
        analysis = JSON.parse(cleaned);
      } catch {
        // Find JSON by braces
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start !== -1 && end > start) {
          try {
            analysis = JSON.parse(cleaned.substring(start, end + 1));
          } catch {
            console.error("Could not parse image verification response:", text);
            // If we can't parse, auto-approve to not block the user
            analysis = { valid: true, description: "Image accepted (parse fallback)", confidence: 0.5, reason: "" };
          }
        } else {
          analysis = { valid: true, description: "Image accepted (parse fallback)", confidence: 0.5, reason: "" };
        }
      }
    }

    return NextResponse.json({
      valid: analysis.valid !== false, // Default to valid unless explicitly false
      description: analysis.description || "Image analyzed",
      confidence: analysis.confidence || 0.5,
      reason: analysis.reason || ""
    });
  } catch (error: any) {
    console.error("Image verification error:", error);
    // On ANY error, auto-approve so submissions aren't blocked
    return NextResponse.json({ valid: true, description: "Image accepted (verification unavailable)", confidence: 0, reason: "" });
  }
}
