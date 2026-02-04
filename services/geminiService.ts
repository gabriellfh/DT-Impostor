
import { GoogleGenAI, Type } from "@google/genai";
import { WordPair } from "../types.ts";
import { SYSTEM_PROMPT, LOCAL_WORD_DATA } from "../constants.tsx";

export const generateWordPair = async (category: string): Promise<WordPair> => {
  // FAST PATH: Se a categoria tiver dados locais, sorteamos instantaneamente
  if (LOCAL_WORD_DATA[category]) {
    const groups = LOCAL_WORD_DATA[category];
    const randomGroup = groups[Math.floor(Math.random() * groups.length)];
    
    if (randomGroup.length >= 2) {
      const shuffled = [...randomGroup].sort(() => Math.random() - 0.5);
      return {
        citizenWord: shuffled[0],
        undercoverWord: shuffled[1]
      };
    }
  }

  // IA PATH: Apenas para categorias dinâmicas ou se o fast path falhar
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest', // Modelo mais rápido para mobile
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
    console.error("Erro ao gerar palavras via API, usando fallback genérico:", error);
    // Fallback de segurança caso a rede falhe
    return { citizenWord: 'Cachorro', undercoverWord: 'Gato' };
  }
};
