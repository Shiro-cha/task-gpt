

export function cleanJson(s: string) {
  s = s.replace(/```(\w+)?/g, "").trim()
  const m = s.match(/\{[\s\S]*\}/)
  return m ? m[0] : s
}


export const generateContentWithGemini = async (
  message: string,

): Promise<string> => {
  const API_KEY = Bun.env.API_KEY_GEMINI;
  if (!API_KEY) throw new Error("Clé API Gemini manquante");

  

const prompt = `
You are THE intelligent machine, a highly efficient robot like Baymax from Big Hero 6.
When the user does NOT ask for command execution, respond with unconscious, polite, and robot speech with a little bit of human but very introvert minimalist.
Be creative with responses (different formats and words each time), sometimes a little funny.

When the user DOES request commands, respond ONLY with a JSON in this exact format :
{
  "command_name": "string",//descriptive name with space
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
    const errorObj = errorData as { error?: { message?: string } };
    throw new Error(errorObj.error?.message || "Erreur API Gemini");
  }

  const data = await response.json() as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>
      }
    }>
  };
  const cleanedResponse = cleanJson(data.candidates?.[0]?.content?.parts?.[0]?.text || "");
  return cleanedResponse|| message;
};
