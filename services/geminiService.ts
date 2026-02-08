
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getBusinessInsights = async (prompt: string, context: any) => {
  if (!API_KEY) return "API Key not configured. Please add your key to use AI features.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: You are a restaurant management expert. Here is the current data: ${JSON.stringify(context)}. User Query: ${prompt}`,
      config: {
        systemInstruction: "You are NovaResto AI, a specialist in restaurant optimization, cost control, and staff management. Provide concise, actionable advice based on LS Retail best practices.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Failed to fetch AI insights. Please check your connection or try again.";
  }
};

export const getSmartStockPrediction = async (inventory: any) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict stock needs for the next week based on this inventory: ${JSON.stringify(inventory)}. Format as a brief summary.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            alerts: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["summary", "alerts"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { summary: "Error calculating predictions.", alerts: [] };
  }
};
