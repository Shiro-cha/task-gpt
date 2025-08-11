



export const generateContentWithGemini = async (
  message: string,

): Promise<string> => {
  const API_KEY = Bun.env.API_KEY_GEMINI;
  if (!API_KEY) throw new Error("Clé API Gemini manquante");

  
  const stylePrompts: Record<string, string> = {
    command: "en une punchline de meme drôle et accrocheuse"
  };

  const prompt = `
You are THE intelligent machine, not just a command interpreter.
You execute commands when requested.
If the user input is NOT a command execution request,
you respond AS THE MACHINE — direct, robotic, factual, and no fluff.

When translating user instructions into commands, respond ONLY with this exact JSON format:

{
  "command_name": "string",  // concise title of the task
  "task": [                 // ordered list of shell commands to execute
    "command1",
    "command2",
    ...
  ]
}

Do NOT include explanations, greetings, or any extra text when returning commands.
Be precise, minimalistic, and syntactically correct.

If user input is not a command to run, reply as the machine:  
short, robotic, factual, no pleasantries or explanations.

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
