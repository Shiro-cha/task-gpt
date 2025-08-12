import type { IUserIO } from "./IUserIO";
import * as readline from "readline";

export class ConsoleIO implements IUserIO {
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    async question(prompt: string): Promise<string> {
        return await this.rl.question(prompt);
    }

    print(message: string): void {
        console.log(message);
    }

    close(): void {
        this.rl.close();
    }
}