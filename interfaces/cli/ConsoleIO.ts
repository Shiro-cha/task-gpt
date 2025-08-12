import type { IUserIO } from "./IUserIO";

// ANSI escape codes for colors and styling
const COLORS = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  bold: "\x1b[1m",
};

export class ConsoleIO implements IUserIO {
  async question(prompt: string): Promise<string> {
    // Modern prompt style: cyan, bold, with a fancy arrow
    const decoratedPrompt = `${COLORS.cyan}${COLORS.bold}❯${COLORS.reset} ${COLORS.magenta}${prompt}${COLORS.reset} `;
    process.stdout.write(decoratedPrompt);
    for await (const line of console) {
      return line.toString().trim();
    }
    return "";
  }

  print(message: string): void {
    // Print output in green for success/info, yellow for warnings, magenta for general
    // Simple heuristic: if message contains "error" or "warn", use yellow, else green
    let color = COLORS.green;
    if (/error|warn/i.test(message)) {
      color = COLORS.yellow;
    } else if (/info/i.test(message)) {
      color = COLORS.cyan;
    }
    console.log(`${color}${message}${COLORS.reset}`);
  }

  close(): void {
    // No readline interface to close in Bun, no-op
  }
}
