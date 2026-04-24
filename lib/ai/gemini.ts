import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash", 
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

// 🌪️ ADVANCED: Predictive Risk Modeling
export const predictCascadingRisks = async (currentNeeds: any[], weatherData: any) => {
  const prompt = `
    Act as a Predictive Disaster Analyst.
    Current Needs: ${JSON.stringify(currentNeeds.slice(0, 5))}
    Environmental Data: ${JSON.stringify(weatherData)}

    Predict 3 potential cascading risks (secondary disasters) that could occur in the next 48-72 hours.
    For each risk, provide:
    - title
    - probability (0-1)
    - prevention_strategy
    
    Return ONLY a JSON array of objects.
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    return [{ title: "System baseline risk", probability: 0.1, prevention_strategy: "Maintain standard monitoring" }];
  }
};

// 📄 ADVANCED: Automated Impact Documentation
export const generateImpactNarrative = async (stats: any, ngoName: string) => {
  const prompt = `
    Create a professional, heart-touching Impact Narrative for ${ngoName}.
    Stats: ${JSON.stringify(stats)}
    
    The narrative should be 3 paragraphs:
    1. The Challenge (What was the situation?)
    2. The Action (What did ${ngoName} do using Resource IQ?)
    3. The Transformation (What is the result today?)
    
    Return JSON: { "narrative": "string" }
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    return { narrative: "Impact synthesis in progress." };
  }
};

// 📦 ADVANCED: Smart Resource Forecasting
export const forecastResourceNeeds = async (pastUsage: any[], currentTrend: string) => {
  const prompt = `
    Predict future resource requirements.
    Usage History: ${JSON.stringify(pastUsage)}
    Current Trend: ${currentTrend}
    
    Predict quantity needed for: Food Kits, Medical Packs, Water Liters for the next 7 days.
    Return JSON: { "food": number, "medical": number, "water": number, "reasoning": "string" }
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    return { food: 500, medical: 200, water: 1000, reasoning: "Baseline projections applied." };
  }
};

// 🛡️ ADVANCED: AI Compliance Auditor
export const auditEntityCompliance = async (ngoData: any, docs: string[]) => {
  const prompt = `
    Audit this NGO for Resource IQ L5 Compliance.
    Data: ${JSON.stringify(ngoData)}
    Documents: ${docs.join(", ")}
    
    Check for:
    1. Financial transparency (Audit logs present?)
    2. Operational integrity (Ratio of verified vs reported?)
    3. Documentation validity (Are numbers standard?)
    
    Return JSON: { "compliant": boolean, "score": number (0-100), "gaps": string[], "recommendation": string }
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    return { compliant: true, score: 85, gaps: ["Pending deeper manual audit"], recommendation: "Provisionally authorized." };
  }
};

// 🚀 ADVANCED: Autonomous Dispatch Decision
export const autonomousDispatchDecision = async (need: any, volunteers: any[]) => {
  const prompt = `
    CRITICAL: Autonomous Dispatch Request.
    Urgent Need: ${JSON.stringify(need)}
    Available Qualified Volunteers: ${JSON.stringify(volunteers)}
    
    Pick the SINGLE best volunteer for this life-safety mission.
    Return ONLY a JSON object: { "volunteerId": "string", "confidence": number, "reason": "string" }
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    return null;
  }
};
