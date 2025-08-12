import type { IUserIO } from "./IUserIO";

export class ConsoleIO implements IUserIO {
  async question(prompt: string): Promise<string> {
    await process.stdout.write(prompt); // no await needed for write

    let input = "";
    const buf = new Uint8Array(1);

    const n = await process.stdin.read(buf);

    const char = String.fromCharCode(buf[0]);

    input += char;
    

    return input.trim();
  }

  print(message: string): void {
    console.log(message);
  }

  close(): void {
    // No readline interface to close in Bun, no-op
  }
}
