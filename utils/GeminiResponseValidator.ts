

export interface GeminiCommand {
  command_name: string;
  task: string[];
}

export class GeminiResponseValidator {

  static isCommand(response: string): GeminiCommand | null {
    try {
      const parsed = JSON.parse(response);

      const isValid =
        typeof parsed.command_name === "string" &&
        Array.isArray(parsed.task) &&
        parsed.task.every((cmd: any) => typeof cmd === "string");

      return isValid ? parsed : null;
    } catch {
      return null;
    }
  }


  static isString(response: string): boolean {
    return this.isCommand(response) === null;
  }
}
