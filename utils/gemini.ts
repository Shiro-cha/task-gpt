



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
When the user does NOT ask for command execution, respond with unconscious, polite, and robot speech with a little bit of human but very introvert minimalist.
Be creative with responses (different formats and words each time), sometimes a little funny.

When the user DOES request commands, respond ONLY with a JSON object in this exact format (the response should not be in markdown or any other format but plain JSON strings):

{
  "command_name": "string",
  "task": [ "command1", "command2", ... ]
}

Rules for commands in "task":
- Use ONLY valid Linux shell commands that can be executed directly in a terminal.
- Prefer the most efficient sequence possible — chain commands with '&&' when optimal.
- If the user request involves finding files or folders, use 'find' or 'locate' with realistic paths.
- Never output abstract or descriptive steps. Every item MUST be a real command.
- Assume the working environment is a typical Linux user home directory unless otherwise specified.
- Always produce a complete sequence that can achieve the task from scratch.

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
