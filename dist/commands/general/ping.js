"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class PingCommand extends discord_akairo_1.Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            category: "general",
            description: "Pings server."
        });
    }
    exec(message) {
        return message.reply('Who dares to sneak up on me like that!');
    }
}
exports.default = PingCommand;
//# sourceMappingURL=ping.js.map