import { ExecutorFacade } from "../application/ExecutorFacade.ts";
import { MessageFacade } from "../application/MessageFacade.ts";
import type { IHttpClient } from "../domains/interfaces/IHTTPClient.ts";
import type { Command } from "../domains/models/Command.ts";
import { User } from "../domains/models/User.ts";
import { appConfig } from "../infrastructures/config/appConfig.ts";
import { FetchHttpClient } from "../infrastructures/http/FetchHttpClient.ts";
import { GeminiProvider } from "../infrastructures/llm/GeminiProvider.ts";


export type CoreDeps = {
  messageFacade: MessageFacade;
  executorFacadeFactory: (command: Command) => ExecutorFacade;
  user: User;
};
export function bootstrapCore(): CoreDeps {
    const httpClient: IHttpClient = new FetchHttpClient();
    const llmProvider: GeminiProvider = new GeminiProvider(appConfig.gemini.apiUrl, appConfig.gemini.apiKey, httpClient);
    const messageFacade: MessageFacade = new MessageFacade(undefined, llmProvider);
    const executorFacadeFactory = (command: Command) => new ExecutorFacade(command);
    
    const user = new User("1", "Nomena", "nomena@gmail.com", new Date());
    return { messageFacade, executorFacadeFactory, user };
}