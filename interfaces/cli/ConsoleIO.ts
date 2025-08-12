import type { IUserIO } from "./IUserIO";

export class ConsoleIO implements IUserIO {
  async question(prompt: string): Promise<string> {
    await Bun.write(prompt); // display prompt

    let input = "";
    const buf = new Uint8Array(1);
    while (true) {
      const n = await Bun.stdin.read(buf);
      if (n === null) break; // EOF

      const char = String.fromCharCode(buf[0]);
      if (char === "\n" || char === "\r") break;

      input += char;
    }

    return input.trim();
  }

  print(message: string): void {
    console.log(message);
  }

  close(): void {
    // No readline interface to close in Bun
  }
}
