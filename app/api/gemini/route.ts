import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini
// Note: In a real app, use process.env.GEMINI_API_KEY
// For this prototype, we'll check if the key exists, otherwise mock or error
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!apiKey) {
            return NextResponse.json({
                reply: "Error: No Gemini API Key found. Please set GEMINI_API_KEY in .env.local",
                intent: "UNKNOWN"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      You are a helpful shopping assistant for a coffee delivery app in China.
      The user said: "${text}"

      Your goal is to extract the user's intent and return a JSON object.
      
      Available Products (Menu):
      - Luckin Coconut Latte (瑞幸生椰拿铁)
      - Luckin Sauce Latte (瑞幸酱香拿铁)
      - Luckin Americano (瑞幸标准美式)
      - Starbucks Latte (星巴克拿铁)
      - Starbucks Caramel Macchiato (星巴克焦糖玛奇朵)
      - Starbucks Frappuccino (星巴克星冰乐)

      Rules:
      1. If the user wants to buy/find something, set intent to "SEARCH" and "product" to the closest matching item name from the menu.
      2. If the user confirms an order (yes, okay, order), set intent to "CONFIRM".
      3. If the user is just chatting, set intent to "CHAT".
      4. "reply" should be a friendly, natural response in Chinese (中文).

      Output Format (JSON only):
      {
        "intent": "SEARCH" | "CONFIRM" | "CHAT",
        "product": "string (optional, only for SEARCH)",
        "reply": "string (in Chinese)"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);

    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({
            reply: "抱歉，我的大脑有点短路了 (API Error)。",
            intent: "UNKNOWN"
        });
    }
}
