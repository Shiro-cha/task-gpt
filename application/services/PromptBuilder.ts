import type { Message } from "../../domains/models/Message";


export class PromptBuilder {
    static forChat(message: Message): string {
        return `You are a helpful assistant. The user says: "${message.text}"`;
    }

    static forCommand(message: Message): string {
        return `
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

User input: "${message.text}"
`;
    }

    static forSummary(message: Message): string {
        return `Summarize the following text:\n\n${message.text}`;
    }
}
