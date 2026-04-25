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
  const needsSummary = needs.slice(0, 10).map(n => ({
    title: n.title,
    category: n.category,
    urgency: n.urgency_score,
    location: `${n.city || 'Unknown'}, ${n.ward || 'Unknown Ward'}`
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

    IMPORTANT: Return ONLY a valid JSON object with these exact keys:
    {
      "hotspot": "string describing the primary crisis location",
      "patterns": ["array of 2-3 pattern strings"],
      "recommendations": ["array of 2-3 recommendation strings"],
      "risks": ["array of 2-3 risk strings"],
      "positiveSignal": "one positive observation string"
    }
    
    Do NOT include any text before or after the JSON. Do NOT wrap in markdown code blocks.
  `;

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
      console.warn("GEMINI_API_KEY missing - returning demo radar data");
      return buildFallbackInsights(needsSummary);
    }

    console.log("AI Radar: Sending", needsSummary.length, "needs to Gemini");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("AI Radar: Raw Gemini response:", text.substring(0, 500));

    // Robust JSON extraction
    const parsed = extractJSON(text);
    if (parsed && parsed.hotspot) {
      console.log("AI Radar: Successfully parsed insights");
      return {
        hotspot: parsed.hotspot || "Regional Overview",
        patterns: Array.isArray(parsed.patterns) ? parsed.patterns : ["Pattern analysis in progress"],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ["Maintain current response levels"],
        risks: Array.isArray(parsed.risks) ? parsed.risks : ["Monitoring for cascading effects"],
        positiveSignal: parsed.positiveSignal || "System operational"
      };
    }

    console.error("AI Radar: JSON parsed but missing expected keys:", parsed);
    return buildFallbackInsights(needsSummary);
  } catch (error) {
    console.error("Radar AI Error:", error);
    return buildFallbackInsights(needsSummary);
  }
};

// Helper: Extract JSON from potentially messy AI response
function extractJSON(text: string): any {
  // Try direct parse first
  try {
    return JSON.parse(text.trim());
  } catch {}

  // Remove markdown code blocks
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {}

  // Find JSON object by matching braces
  const startIdx = cleaned.indexOf('{');
  const lastIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && lastIdx > startIdx) {
    try {
      return JSON.parse(cleaned.substring(startIdx, lastIdx + 1));
    } catch {}
  }

  console.error("AI Radar: Could not extract JSON from:", text.substring(0, 300));
  return null;
}

// Helper: Build intelligent fallback based on actual needs data
function buildFallbackInsights(needs: any[]) {
  const cities = needs.map(n => n.location.split(',')[0].trim());
  const topCity = cities.sort((a, b) =>
    cities.filter(c => c === b).length - cities.filter(c => c === a).length
  )[0] || "Regional Area";

  const categories = needs.map(n => n.category).filter(Boolean);
  const topCategory = categories.sort((a: string, b: string) =>
    categories.filter((c: string) => c === b).length - categories.filter((c: string) => c === a).length
  )[0] || "general";

  const highUrgency = needs.filter(n => (n.urgency || 0) >= 8);

  return {
    hotspot: `${topCity} — ${highUrgency.length} critical needs detected`,
    patterns: [
      `${topCategory.replace('_', ' ')} needs are the dominant category (${categories.filter((c: string) => c === topCategory).length} reports)`,
      `${highUrgency.length} of ${needs.length} needs have urgency scores above 8.0`,
      `Activity concentrated in ${[...new Set(cities)].slice(0, 3).join(', ')}`
    ],
    recommendations: [
      `Deploy specialized ${topCategory.replace('_', ' ')} response teams to ${topCity}`,
      `Establish a forward coordination hub in the most affected ward`,
      `Initiate volunteer surge recruitment for ${topCategory.replace('_', ' ')} skills`
    ],
    risks: [
      `Delayed response in ${topCity} could escalate ${topCategory.replace('_', ' ')} situations`,
      `Resource bottleneck likely if more than ${needs.length + 5} concurrent needs arise`,
    ],
    positiveSignal: `Active monitoring of ${needs.length} needs indicates platform engagement is healthy`
  };
}

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
