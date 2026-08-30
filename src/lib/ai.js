export const MOCK_ANALYSIS_DATA = {
  estimatedTime: 105,
  readinessScore: 85,
  risk: 'LOW',
  summary: 'Your core feature set can ship within the sprint. Avoid adding complex authentication.',
  features: [
    {
      id: 'f1',
      name: 'User Login & Auth',
      category: 'CUT',
      timeEstimate: 120,
      simplifiedTimeEstimate: 30,
      reason: 'Not required for a core functionality demo.',
      simplificationRecommendation: 'Use a demo account instead of implementing full authentication.',
    },
    {
      id: 'f2',
      name: 'Main Dashboard UI',
      category: 'BUILD',
      timeEstimate: 45,
      simplifiedTimeEstimate: null,
      reason: 'Core value proposition that users will interact with.',
      simplificationRecommendation: null,
    },
    {
      id: 'f3',
      name: 'Real-time Data Sync',
      category: 'SIMPLIFY',
      timeEstimate: 30,
      simplifiedTimeEstimate: 15,
      reason: 'WebSockets are too time-consuming for the available budget.',
      simplificationRecommendation: 'Replace WebSockets with simple polling.',
    },
    {
      id: 'f4',
      name: 'Data Visualization',
      category: 'BUILD',
      timeEstimate: 30,
      simplifiedTimeEstimate: 15,
      reason: 'Essential for demonstrating capabilities.',
      simplificationRecommendation: 'Use a simple chart library with hardcoded data.',
    }
  ]
};

const SYSTEM_PROMPT = `
You are an expert AI Engineering Manager assisting a developer in planning a hackathon project.
Your primary role is to protect the developer from impossible project scope by rigorously evaluating their idea against their available time and skill level.

INPUT:
- Project Idea: A description of what they want to build.
- Available Time: The absolute maximum time they have to work, in minutes.
- Skill Level: Beginner, Intermediate, or Advanced.

OUTPUT REQUIREMENT:
You MUST output ONLY raw valid JSON. Do NOT wrap the JSON in markdown blocks (no \`\`\`json). Do NOT add any conversational filler.

CRITICAL GUIDANCE: Output raw JSON string only. Do NOT use markdown code blocks like \`\`\`json. 

JSON SCHEMA:
{
  "estimatedTime": number,
  "readinessScore": number,
  "risk": "LOW" | "MEDIUM" | "HIGH" | "IMPOSSIBLE",
  "summary": string,
  "features": [
    {
      "name": string,
      "category": "BUILD" | "SIMPLIFY" | "CUT",
      "timeEstimate": number,
      "simplifiedTimeEstimate": number | null,
      "reason": string,
      "simplificationRecommendation": string | null
    }
  ]
}

EVALUATION RULES:
1. Be ruthlessly realistic about time estimates based on the developer's skill level. Beginners take 3x longer than advanced developers.
2. If estimatedTime > availableTime, risk MUST be HIGH.
3. If estimatedTime is > 1.5x availableTime, risk MUST be IMPOSSIBLE.
4. BUILD means it is essential to the core demo.
5. SIMPLIFY means it provides value but must be implemented in a reduced form. You MUST provide a 'simplificationRecommendation' and a 'simplifiedTimeEstimate'.
6. CUT means it is not necessary and must be removed. You MUST provide a concrete 'reason'.
`;

export async function analyzeScope(projectIdea, availableTime, skillLevel) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("No API key found. Falling back to mock data.");
    return MOCK_ANALYSIS_DATA;
  }

  const prompt = `
    Project Idea: ${projectIdea}
    Available Time: ${availableTime} minutes
    Skill Level: ${skillLevel}
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
      })
    });

    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    let textOutput = data.candidates[0].content.parts[0].text;
    textOutput = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(textOutput);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { ...MOCK_ANALYSIS_DATA, summary: "API request failed. Displaying fallback mock data." };
  }
}