import {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} from "discord-akairo";
import * as path from "path";
import IMyClient from "./client.interface";
import config from "./config";
import { fetch } from "./config/fetch";
class MyClient extends AkairoClient implements IMyClient {
  commandHandler: CommandHandler;
  listenerHandler: ListenerHandler;
  inhibitorHandler: InhibitorHandler;
  constructor() {
    super(
      {
        ownerID: "384079582267047937", // or ['123992700587343872', '86890631690977280']
      },
      {
        disableMentions: "everyone",
        presence: {activity: {name: "!king help", type: "LISTENING"}, status: "online"}
      }
    );
    this.commandHandler = new CommandHandler(this, {
      directory: path.join(__dirname, "./commands/"),
      prefix: config.bot.prefix, // or ['?', '!']
    });
    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: path.join(__dirname, "./inhibitors/"),
    });
    this.listenerHandler = new ListenerHandler(this, {
      directory: path.join(__dirname,"./listeners/"),
    });

    this.load();
  }
  start() {
    this.login(process.env.DISCORD_BOT_TOKEN);
  }
  load() {
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.inhibitorHandler.loadAll();

    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();

    this.commandHandler.loadAll();

  }
}

export default new MyClient();

export const cachedUsers = new Map<string, {username: string}>();
// (async function init(){
//   const res = await fetch(`${config.api.prefix}/user`, "GET")
//   const users = await res.json();
//   users.forEach((user) => cachedUsers.set(user.oauth_id, user)); 
//   console.log(cachedUsers);
// })();
