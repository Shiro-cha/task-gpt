import { CommandFactory } from "../../application/factories/CommandFactory.ts";
import { bootstrapCore } from "../../composition/bootstrapCore.ts";
import { Message } from "../../domains/models/Message.ts";

export const runner = async (
  print: (message: string) => void,
  question: (prompt: string) => Promise<string>
): Promise<void> => {
  const { messageFacade, executorFacadeFactory, user } = bootstrapCore();


  const input: string = await question("\n ➜ 🚀 ");

  const message = new Message(user.id, input, new Date(), user);


  await messageFacade.setMessage(message);


  const geminiResponse: string = await messageFacade.sendMessage();


  const command = CommandFactory.createFromGeminiResponse(geminiResponse);

  if (command) {
    const executorFacade = executorFacadeFactory(command);
    const output: string = await executorFacade.executeCommand();
    print(output);
  } else {
    print(geminiResponse);
  }
};
