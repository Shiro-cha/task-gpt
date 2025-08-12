import type { IUserIO } from "./IUserIO";

export class ConsoleIO implements IUserIO {
  async question(prompt: string): Promise<string> {

    process.stdout.write(prompt);
    for await (const line of console) {
      return line.toString().trim();
    }
  }

  print(message: string): void {
    console.log(message);
  }

  close(): void {
    // No readline interface to close in Bun, no-op
  }
}
