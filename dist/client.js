"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachedUsers = exports.stories = void 0;
const discord_akairo_1 = require("discord-akairo");
const path = require("path");
const config_1 = require("./config");
class MyClient extends discord_akairo_1.AkairoClient {
    constructor() {
        super({
            ownerID: "384079582267047937",
        }, {
            disableMentions: "everyone",
            presence: { activity: { name: "!king help", type: "LISTENING" }, status: "online" }
        });
        this.commandHandler = new discord_akairo_1.CommandHandler(this, {
            directory: path.join(__dirname, "./commands/"),
            prefix: config_1.default.bot.prefix,
        });
        this.inhibitorHandler = new discord_akairo_1.InhibitorHandler(this, {
            directory: path.join(__dirname, "./inhibitors/"),
        });
        this.listenerHandler = new discord_akairo_1.ListenerHandler(this, {
            directory: path.join(__dirname, "./listeners/"),
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
exports.default = new MyClient();
exports.stories = new Map();
exports.stories.set("sample", new Map());
exports.cachedUsers = new Map();
// (async function init(){
//   const res = await fetch(`${config.api.prefix}/user`, "GET")
//   const users = await res.json();
//   users.forEach((user) => cachedUsers.set(user.oauth_id, user)); 
//   console.log(cachedUsers);
// })();
//# sourceMappingURL=client.js.map