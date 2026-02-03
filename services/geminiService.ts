
import { GoogleGenAI, Type } from "@google/genai";
import { WordPair } from "../types.ts";
import { SYSTEM_PROMPT } from "../constants.tsx";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateWordPair = async (category: string): Promise<WordPair> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere um par de palavras para a categoria: ${category}.`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            citizenWord: { type: Type.STRING },
            undercoverWord: { type: Type.STRING },
          },
          required: ["citizenWord", "undercoverWord"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      citizenWord: result.citizenWord || 'Maçã',
      undercoverWord: result.undercoverWord || 'Pêra'
    };
  } catch (error) {
    console.error("Erro ao gerar palavras:", error);
    return { citizenWord: 'Maçã', undercoverWord: 'Pêra' };
  }
};
