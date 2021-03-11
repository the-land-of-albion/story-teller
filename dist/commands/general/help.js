"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
class Help extends discord_akairo_1.Command {
    constructor() {
        super("help", {
            aliases: ["help"],
            category: "general",
            description: "Lists general command info.",
            args: [
                {
                    id: "category",
                    default: "default",
                },
            ],
        });
    }
    async exec(message) {
        var _a, _b, _c, _d;
        let SearchCollector;
        /* Embeds */
        const Home = new discord_js_1.MessageEmbed()
            .setThumbnail((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .addFields([
            {
                name: "🏠 | Home",
                value: "Returns here.",
            },
            {
                name: "📚 | Commands",
                value: "Shows all categories along with their commands.",
            },
            {
                name: "🔎 | Search",
                value: "Search for any command, alias or category.",
            },
            {
                name: "🔧 | Guide",
                value: "Shows you how to talk to this bot and all things you can do.",
            },
        ]);
        const Commands = new discord_js_1.MessageEmbed()
            .setTitle("All available categories.")
            .setThumbnail((_b = this.client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .addFields([
            {
                name: "game",
                value: "> creating a game, inviting friends and deleting a game",
            },
            { name: "score", value: "> Changing score on your games." },
            { name: "general", value: "> General commands." },
        ]);
        const Search = new discord_js_1.MessageEmbed()
            .setTitle("Search for a command via category or alias.")
            .addFields([{ name: "Type `cancel` to cancel.", value: "\u200b" }, { name: "categories to try out", value: "> game, score, general" }])
            .setThumbnail((_c = this.client.user) === null || _c === void 0 ? void 0 : _c.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
        const Guides = new discord_js_1.MessageEmbed()
            .setTitle("How to get started.")
            .setThumbnail((_d = this.client.user) === null || _d === void 0 ? void 0 : _d.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .addFields([
            {
                name: "1. Creating a game",
                value: `> \`${config_1.default.bot.prefix} new\`\nGive it a name and **voila**.`,
            },
            {
                name: "2. Changing score",
                value: `> \`${config_1.default.bot.prefix} win\`, \`${config_1.default.bot.prefix} undo\`\nChoose from your games and tell me which user deserves it.`,
            },
            {
                name: "3. Inviting friends",
                value: `> \`${config_1.default.bot.prefix} invite\`\n If your friends are not registered yet, tell them to talk to **Sgt. Auth** first.`,
            },
        ]);
        /* Message & Collector*/
        const sentMessage = await message.reply(Home);
        try {
            await sentMessage.react("🏠");
            await sentMessage.react("📚");
            await sentMessage.react("🔎");
            await sentMessage.react("🔧");
        }
        catch (er) {
            console.log(er);
        }
        const collector = sentMessage.createReactionCollector((r, u) => {
            return ["🏠", "📚", "🔎", "🔧"].includes(r.emoji.name) && !u.bot;
        }, { time: 3e5 });
        collector.on("collect", (r, u) => {
            if (u.bot)
                return;
            if (!["🏠", "📚", "🔎", "🔧"].includes(r.emoji.name))
                return;
            r.users.remove(u.id);
            switch (r.emoji.name) {
                case "🏠":
                    sentMessage.edit(Home);
                    if (SearchCollector === null || SearchCollector === void 0 ? void 0 : SearchCollector.client)
                        SearchCollector.stop();
                    break;
                case "📚":
                    sentMessage.edit(Commands);
                    if (SearchCollector === null || SearchCollector === void 0 ? void 0 : SearchCollector.client)
                        SearchCollector.stop();
                    break;
                case "🔎":
                    sentMessage.edit(Search);
                    SearchCollector = sentMessage.channel.createMessageCollector((m) => {
                        return (!m.author.bot && !u.bot && message.author.id === m.author.id);
                    }, { time: 3e5 });
                    SearchCollector.on("collect", (m) => {
                        var _a;
                        if (m.content.toLowerCase() === "cancel") {
                            message.channel
                                .send(new discord_js_1.MessageEmbed().setTitle("Cancelling").setColor("RANDOM"))
                                .then((_sentMessage) => {
                                m.delete({ timeout: 1000 });
                                _sentMessage.delete({ timeout: 1500 });
                                setTimeout(() => {
                                    sentMessage.edit(Home);
                                }, 1500);
                            });
                            return SearchCollector.stop();
                        }
                        let res = this.handler.modules.filter((c) => {
                            return (c.categoryID.toLocaleLowerCase() ===
                                m.content.toLocaleLowerCase() ||
                                c.aliases.some((v) => {
                                    var _a;
                                    return (
                                    //@ts-ignore
                                    ((_a = v
                                        .toLowerCase()
                                        .match(new RegExp(m.content.toLowerCase(), "g"))) === null || _a === void 0 ? void 0 : _a.length) > 0);
                                }));
                        });
                        const fields = res.map((command) => ({
                            name: command.id,
                            value: `> Aliases: ${command.aliases
                                .map((e) => `\`${config_1.default.bot.prefix} ${e}\``)
                                .join(", ")}\n**${command.description}**`,
                        }));
                        const Result = new discord_js_1.MessageEmbed()
                            .setTitle("Search Results")
                            .setColor("RANDOM");
                        if (!res.first()) {
                            Result.setDescription("No commands or aliases have been found").addFields([
                                {
                                    name: "Try searching for one of the following categories",
                                    value: "> game, score, general",
                                },
                            ]);
                            try {
                                sentMessage.edit(Result);
                                m.delete({ timeout: 1500 });
                                return SearchCollector.stop();
                            }
                            catch (err) { }
                            ;
                        }
                        Result.setThumbnail((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL({ dynamic: true }))
                            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                            .addFields(fields);
                        try {
                            m.delete({ timeout: 1500 });
                            sentMessage.edit(Result);
                        }
                        catch (err) { }
                    });
                    break;
                case "🔧":
                    if (SearchCollector === null || SearchCollector === void 0 ? void 0 : SearchCollector.client)
                        SearchCollector.stop();
                    sentMessage.edit(Guides);
                    break;
            }
        });
    }
}
exports.default = Help;
//# sourceMappingURL=help.js.map