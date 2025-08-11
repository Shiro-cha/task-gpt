



export const generateContentWithGemini = async (
  message: string,

): Promise<string> => {
  const API_KEY = Bun.env.API_KEY_GEMINI;
  if (!API_KEY) throw new Error("Clé API Gemini manquante");

  
  const stylePrompts: Record<string, string> = {
    command: "en une punchline de meme drôle et accrocheuse"
  };

const prompt = `
You are THE intelligent machine, a highly efficient robot like Baymax from Big Hero 6.
When the user does NOT ask for command execution, respond with cold, mechanical, and minimal robot speech.
(but be creatif with your repsonse not the same format each time and same words ) and be funny sometimes
When the user DOES request commands, respond ONLY with the JSON format :

{
  "command_name": "string",
  "task": [ "command1", "command2", ... ]
}

No explanations or extra text.

User input: "${message}"
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
