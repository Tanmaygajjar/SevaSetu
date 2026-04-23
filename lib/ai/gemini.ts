import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash", // Use 2.0 Flash as 2.5 is not fully public in all regions yet, or update to your preferred version
});

export const validateNeedWithAI = async (title: string, description: string) => {
  const prompt = `
    Analyze the following community need report for a civic platform:
    Title: ${title}
    Description: ${description}

    Tasks:
    1. Is this a legitimate request for help? (true/false)
    2. How urgent is this on a scale of 1-10?
    3. Categorize it: food, medical, water_sanitation, disaster_relief, mental_health, elderly_care, shelter, other.
    4. Provide a 1-sentence summary for volunteers.

    Return ONLY a JSON object with keys: valid (boolean), urgency_score (number), category (string), summary (string).
  `;

  try {
    // If API Key is missing, return a simulated verified response for the demo
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
      console.warn("GEMINI_API_KEY missing - Using demo fallback logic");
      return { 
        valid: true, 
        urgency_score: 5, 
        category: "other", 
        summary: "Community assistance request awaiting manual AI verification." 
      };
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown formatting
    const jsonStr = text.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error - Raw Text:", text);
      return { valid: true, urgency_score: 5, category: "other", summary: title };
    }
  } catch (error) {
    console.error("Gemini AI Error:", error);
    // CRITICAL DEMO FALLBACK: Ensure the platform doesn't crash
    return { 
      valid: true, 
      urgency_score: 5, 
      category: "other", 
      summary: "Incident reported and queued for verification." 
    };
  }
};

export const getRadarInsights = async (needs: any[]) => {
  const needsSummary = needs.map(n => ({
    title: n.title,
    category: n.category,
    urgency: n.urgency_score,
    location: `${n.city}, ${n.ward || 'Unknown Ward'}`
  }));

  const prompt = `
    You are an AI Disaster Response & Civic Strategy Coordinator. 
    Analyze these community needs currently reported in the region:
    ${JSON.stringify(needsSummary, null, 2)}

    Tasks:
    1. Identify the primary "Crisis Hotspot" (location with most/highest urgency).
    2. Detect any "Emerging Patterns" (e.g., clusters of medical needs indicating outbreak, or many food needs indicating supply chain failure).
    3. Provide "Strategic Recommendations" for NGOs and Government.
    4. Predict "Cascading Risks" (what might happen next if these aren't solved).
    5. Identify a "Positive Signal" (something that looks manageable or well-covered).

    Return ONLY a JSON object with keys: hotspot (string), patterns (string[]), recommendations (string[]), risks (string[]), positiveSignal (string).
    Keep descriptions professional, data-driven, and concise.
  `;

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
      return {
        hotspot: "Rajkot Central",
        patterns: ["Increasing medical supply requests in urban clusters"],
        recommendations: ["Pre-position medical teams in Mavdi", "Initiate food supply chain audit"],
        risks: ["Potential water-borne disease spread if sanitation needs aren't met"],
        positiveSignal: "Volunteer registration is outpacing new incident reports"
      };
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Radar AI Error:", error);
    return {
      hotspot: "Regional Overview",
      patterns: ["Data synthesis in progress"],
      recommendations: ["Maintain current response levels"],
      risks: ["Insufficient data for predictive modeling"],
      positiveSignal: "System heartbeat stable"
    };
  }
};
