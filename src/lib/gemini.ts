import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface BusinessIdea {
  title: string;
  oneLiner: string;
  problem: string;
  solution: string;
  targetAudience: string;
  revenueModel: string;
  potentialRisks: string[];
  nextSteps: string[];
}

export async function generateBusinessIdea(prompt: string): Promise<BusinessIdea> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Transform this rough idea into a structured business concept: ${prompt}`,
    config: {
      systemInstruction: "You are an expert startup consultant and venture architect. Your goal is to take rough ideas and turn them into professional, viable business concepts. Be creative, analytical, and practical.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          oneLiner: { type: Type.STRING },
          problem: { type: Type.STRING },
          solution: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          revenueModel: { type: Type.STRING },
          potentialRisks: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          nextSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "oneLiner", "problem", "solution", "targetAudience", "revenueModel", "potentialRisks", "nextSteps"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}

export interface CrushingAnalysis {
  brutalHonesty: string;
  technicalMoats: string[];
  marketKillers: string[];
  financialPains: string[];
  executionDifficulty: number; // 1-100
}

export async function crushIdea(title: string, prompt: string): Promise<CrushingAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Brutally analyze and 'crush' this business idea: '${title}'. Context: ${prompt}`,
    config: {
      systemInstruction: "You are a cynical, highly experienced venture capitalist and technical architect. Your job is to find every single reason why this business will FAIL. Be brutal, realistic, and focus on technical complexity, market saturation, and operational nightmares. Do not give any praise. Focus on what is EXTREMELY difficult to do.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brutalHonesty: { type: Type.STRING },
          technicalMoats: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "The hardest technical things to build that could bankrupt the project."
          },
          marketKillers: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Market forces or competitors that will destroy this."
          },
          financialPains: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Where the money will vanish."
          },
          executionDifficulty: { type: Type.NUMBER }
        },
        required: ["brutalHonesty", "technicalMoats", "marketKillers", "financialPains", "executionDifficulty"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}
export async function generateBrandImage(title: string, oneLiner: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: `A professional, minimalist, high-end brand identity visual or conceptual logo for a startup called '${title}'. Description: ${oneLiner}. Style: Clean, modern, corporate yet innovative. No text, high quality.`,
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "";
}
