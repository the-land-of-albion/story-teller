import { Command } from 'discord-akairo';
import { Message } from "discord.js";

class PingCommand extends Command {
    constructor() {
        super('ping', {
           aliases: ['ping'],
           category: "general",
           description: "Pings server."
        });
    }

    exec(message: Message) {
        return message.reply('Who dares to sneak up on me like that!');
    }
}

export default PingCommand;