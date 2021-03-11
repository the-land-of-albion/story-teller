"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPC = exports.PirateStats = exports.BaseStats = void 0;
const discord_js_1 = require("discord.js");
exports.BaseStats = {
    health: 100,
    defense: 1,
    attack: 10,
};
exports.PirateStats = {
    health: 100,
    defense: 0.8,
    attack: 12.5,
};
class NPC {
    constructor(options) {
        const { name, iconURL, color, message, stats } = options;
        this.name = name;
        this.iconURL = iconURL;
        this.color = color || "RANDOM";
        this.message = message;
        // this.listener = message.member as GuildMember;
        this.stats = stats || exports.BaseStats;
    }
    talk(message) {
        const TalkEmbed = new discord_js_1.MessageEmbed()
            .setThumbnail(this.iconURL)
            .setAuthor(this.name)
            .setColor(this.color)
            .setDescription(message || "\u200b");
        // .setFooter(`Requested by ${this.message.author.username}`, this.message.author.displayAvatarURL({dynamic: true}))
        return TalkEmbed;
    }
}
exports.NPC = NPC;
//# sourceMappingURL=index.js.map