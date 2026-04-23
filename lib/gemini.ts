import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function validateNeedDescription(
  title: string,
  description: string,
  category: string
): Promise<{ valid: boolean; flags: string[]; score: number }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a content moderator for a social impact platform in India called SevaSetu.
Analyze this community need report for quality and appropriateness.

Title: ${title}
Description: ${description}
Category: ${category}

Check for:
1. Spam or promotional content
2. Inappropriate or offensive language
3. Completeness (enough detail to act on)
4. Relevance to the category

Respond in JSON format ONLY:
{"valid": true/false, "flags": ["list of issues if any"], "score": 0.0 to 1.0}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { valid: true, flags: [], score: 0.8 };
  } catch {
    // Fallback if API unavailable
    return { valid: true, flags: [], score: 0.7 };
  }
}

export async function suggestSDGTags(
  title: string,
  description: string,
  category: string
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Given this community need, suggest 1-3 relevant UN Sustainable Development Goals.
Title: ${title}
Description: ${description}
Category: ${category}

Available SDGs: SDG2 (Zero Hunger), SDG3 (Good Health), SDG4 (Quality Education), SDG6 (Clean Water), SDG10 (Reduced Inequalities), SDG11 (Sustainable Cities)

Respond with JSON ONLY: {"sdgTags": ["SDG2", "SDG3"]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.sdgTags || [];
    }
    return ['SDG11'];
  } catch {
    // Fallback based on category
    const categorySDGMap: Record<string, string[]> = {
      food: ['SDG2'],
      medical: ['SDG3'],
      education: ['SDG4'],
      water_sanitation: ['SDG6'],
      shelter: ['SDG11'],
      livelihood: ['SDG10'],
      elderly_care: ['SDG3', 'SDG10'],
      disaster_relief: ['SDG11'],
      mental_health: ['SDG3'],
      child_welfare: ['SDG4', 'SDG10'],
    };
    return categorySDGMap[category] || ['SDG11'];
  }
}

export async function generateImpactSummary(
  ngoName: string,
  stats: { tasksCompleted: number; peopleHelped: number; hours: number; topCategories: string[] }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Write a 2-3 paragraph impact narrative for NGO "${ngoName}".
Stats: ${stats.tasksCompleted} tasks completed, ${stats.peopleHelped} people helped, ${stats.hours} volunteer hours.
Top categories: ${stats.topCategories.join(', ')}
Write in a warm, professional, report-ready tone suitable for an impact report. Keep it under 200 words.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return `${ngoName} has made significant community impact with ${stats.tasksCompleted} completed tasks, helping ${stats.peopleHelped} people across ${stats.hours} volunteer hours.`;
  }
}

export async function explainMatch(
  volunteerName: string,
  needTitle: string,
  matchScore: number,
  breakdown: { skillFit: number; proximity: number; availability: number; performance: number }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Explain in 2-3 simple sentences why volunteer "${volunteerName}" is a good match for the need "${needTitle}".
Match score: ${matchScore}/100
Breakdown: Skill Fit ${breakdown.skillFit}/35, Proximity ${breakdown.proximity}/30, Availability ${breakdown.availability}/20, Performance ${breakdown.performance}/15
Write in plain, friendly language.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return `${volunteerName} scored ${matchScore}/100, with strong skill alignment and proximity to the need location.`;
  }
}
