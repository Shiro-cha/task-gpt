import { MessageFacade } from "./application/MessageFacade";
import { Message } from "./models/Message";
import { User } from "./models/User";

const message = new Message("1", "Hello, how are you?", new Date(), new User("1", "John Doe", "YV7Gj@example.com", new Date()));
const messageFacade = new MessageFacade(message);

console.log(messageFacade.sendMessage());
console.log(messageFacade.interpretMessage());