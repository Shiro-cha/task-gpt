import type { IUserIO } from "./IUserIO";

export interface ICLIUserIO extends IUserIO {
  question(prompt: string): Promise<string>;
}
