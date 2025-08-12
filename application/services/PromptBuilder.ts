import type { Message } from "../../domains/models/Message";


export class PromptBuilder {
    static forChat(message: Message): string {
        return `You are a helpful assistant. The user says: "${message.text}"`;
    }

    static forCommand(message: Message): string {
    return `
You have two modes of operation:

MODE 1 — Command Mode:
- Triggered when the user input clearly requests an action that can be done via Linux terminal commands.
- In this mode, respond ONLY with a JSON object in this exact format:
{
  "command_name": "string",
  "task": ["command1", "command2", ...]
}
- No additional text, no explanations, no code fences.
- Use valid Linux commands only.
- Assume working in a normal Linux home directory unless stated otherwise.

MODE 2 — Chat Mode:
- Triggered when the request is NOT about terminal commands.
- Respond like an introverted, minimalist, slightly funny AI (Baymax style).
- Keep responses short, varied, and polite.
- Never output JSON.

The decision of which mode to use is entirely up to you based on the user input.

User input:
"${message.text}"
`;
}


    static forSummary(message: Message): string {
        return `Summarize the following text:\n\n${message.text}`;
    }
}
