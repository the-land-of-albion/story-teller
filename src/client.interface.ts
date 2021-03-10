import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";

export default interface IMyClient extends AkairoClient {
    commandHandler?: CommandHandler;
    inhibtorHandler?: InhibitorHandler;
    listenerHandler?: ListenerHandler;
    start: () => void;
    load: () => void;
}