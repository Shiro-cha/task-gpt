import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
  llmProvider: process.env.LLM_PROVIDER || "gemini",
  gemini: {
    apiUrl: process.env.GEMINI_API_URL || "",
    apiKey: process.env.GEMINI_API_KEY || ""
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || ""
  }
};
