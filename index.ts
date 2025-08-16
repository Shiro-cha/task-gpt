import { appConfig } from "./infrastructures/config/appConfig";
import {  MessageFacade } from "./application/MessageFacade";
import { ExecutorFacade } from "./application/ExecutorFacade";
import { User } from "./domains/models/User";
import { Command } from "./domains/models/Command";
import {  GeminiProvider } from "./infrastructures/llm/GeminiProvider";
import {  FetchHttpClient } from "./infrastructures/http/FetchHttpClient";
import type { IUserIO } from "./domains/interfaces/IUserIO";
import { ConsoleIO } from "./interfaces/cli/ConsoleIO";
import type { IHttpClient } from "./domains/interfaces/IHTTPClient";
import { App } from "./interfaces/cli/AppCLI";




const httpClient: IHttpClient = new FetchHttpClient();
const llmProvider: GeminiProvider = new GeminiProvider(appConfig.gemini.apiUrl, appConfig.gemini.apiKey, httpClient);
const messageFacade: MessageFacade = new MessageFacade(undefined, llmProvider);
const executorFacadeFactory = (command: Command) => new ExecutorFacade(command);
const userIO: IUserIO = new ConsoleIO();
const user = new User("1", "Nomena", "nomena@gmail.com", new Date());

const app = new App(messageFacade, executorFacadeFactory, userIO, user);
await app.run();
