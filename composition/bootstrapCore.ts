import { ExecutorFacade } from "../application/ExecutorFacade";
import { MessageFacade } from "../application/MessageFacade";
import type { IHttpClient } from "../domains/interfaces/IHTTPClient";
import type { Command } from "../domains/models/Command";
import { User } from "../domains/models/User";
import { appConfig } from "../infrastructures/config/appConfig";
import { FetchHttpClient } from "../infrastructures/http/FetchHttpClient";
import { GeminiProvider } from "../infrastructures/llm/GeminiProvider";


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