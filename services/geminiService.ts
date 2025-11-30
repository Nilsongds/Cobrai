import { GoogleGenAI, Type } from "@google/genai";
import { DebtAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const parseDebtFromText = async (text: string): Promise<DebtAnalysis | null> => {
  if (!text || !text.trim()) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following text and extract debt information. Today is ${new Date().toISOString()}.
      Text: "${text}"`,
      config: {
        systemInstruction: `You are a financial assistant specializing in parsing debt records from informal Portuguese text.
        Extract the debtor's name, the amount, a short description, an inferred category (e.g., Food, Transport, Loan, Utilities), and a due date if mentioned (convert relative dates like 'next friday' to ISO 8601 format YYYY-MM-DD).
        If no date is mentioned, return null for dueDate.
        Confidence score should be between 0 and 1 based on how clear the text is.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personName: { type: Type.STRING, description: "Name of the person who owes money" },
            amount: { type: Type.NUMBER, description: "Numeric amount of the debt" },
            description: { type: Type.STRING, description: "Brief reason for the debt" },
            dueDate: { type: Type.STRING, description: "ISO Date string YYYY-MM-DD or null" },
            category: { type: Type.STRING, description: "Category of the expense" },
            confidenceScore: { type: Type.NUMBER, description: "0.0 to 1.0" }
          },
          required: ["personName", "amount", "description", "confidenceScore", "category"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as DebtAnalysis;
  } catch (error) {
    console.error("Error parsing debt with Gemini:", error);
    return null;
  }
};

export const getFinancialAdvice = async (debtsSummary: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a very short, motivating, and tactical financial tip (max 2 sentences) based on this summary of debts I need to collect: ${debtsSummary}. Speak Portuguese.`,
    });
    return response.text || "Mantenha suas finanças organizadas!";
  } catch (error) {
    return "Mantenha o foco em receber o que lhe devem.";
  }
};