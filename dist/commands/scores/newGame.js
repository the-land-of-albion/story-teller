"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const fetch_1 = require("../../config/fetch");
const Game_1 = require("../../util/Game");
class NewGame extends discord_akairo_1.Command {
    constructor() {
        super("new game", {
            aliases: ["new", "n"],
            channel: "guild",
            category: "game",
            description: "Creates new game.",
            args: [
                { id: "game", type: "string", prompt: {
                        start: "We need a name to label what it is your tracking?",
                        ended: "dont work",
                        timeout: "Ai, were we a wee bit too slow huh?",
                        cancel: "Respect that lad. Talk to ya'r later.",
                        retry: "Let's try this again, we just need a name."
                    } },
            ],
        });
    }
    async exec(message, args) {
        var _a;
        const game = new Game_1.default(args.game, []).build();
        fetch_1.fetch(`http://localhost:3000/user/${(_a = message.member) === null || _a === void 0 ? void 0 : _a.id}/game`, "POST", { body: { title: args.game, _title: args.game.toLowerCase() } })
            .then(async (e) => {
            if (e.status == 409) {
                return message.reply("☠️ Ya'r know, ya'r have a game with that name!");
            }
            return message.reply(`🏴‍☠️ Ai, ya'r now tracking ${args.game}.`);
        }).catch((err) => {
            return message.reply("☠️ Ship's sinking!");
        });
    }
}
exports.default = NewGame;
//# sourceMappingURL=newGame.js.map