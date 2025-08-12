import { Command } from "../../domains/models/Command";
import { GeminiResponseValidator } from "../../utils/GeminiResponseValidator";

export class CommandFactory {
    static createFromGeminiResponse(response: string): Command | null {
        if (!GeminiResponseValidator.isCommand(response)) return null;
        try {
            const responseJson = JSON.parse(response);
            if (
                typeof responseJson.command_name !== "string" ||
                !Array.isArray(responseJson.task)
            ) {
                return null;
            }
            return new Command(
                responseJson.command_name,
                responseJson.task.join(" && "),
                new Date(),
                "Pending"
            );
        } catch {
            return null;
        }
    }
}