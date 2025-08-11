
import dotenv from 'dotenv'

// Charge les variables du fichier .env dans process.env
dotenv.config()

console.log(process.env.PORT)          // Affiche 3000
console.log(process.env.API_KEY_GEMINI) // Affiche ta clé API


export const generateContentWithGemini = async (
  message: string,

): Promise<string> => {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) throw new Error("Clé API Gemini manquante");

  
  const stylePrompts: Record<string, string> = {
    command: "en une punchline de meme drôle et accrocheuse"
  };

  const prompt = `
  You are an expert command translator.  
Given a user message, translate it into a JSON command object in this exact format:

{
  "command_name": "string",
  "parameters": {
    // parameter keys and values
  }
}

**Important: Return ONLY the JSON object. Do NOT add any explanation, text, or formatting.**

User message: "<USER_MESSAGE>"

  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      },
  )}
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Erreur API Gemini");
  }

  //console.log(response);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || message;
};

function fetch(arg0: string, arg1: { method: string; headers: { "Content-Type": string; }; body: string; }) {
    throw new Error("Function not implemented.");
}
