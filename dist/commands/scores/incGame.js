"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const fetch_1 = require("../../config/fetch");
class WinGame extends discord_akairo_1.Command {
    constructor() {
        super("increment score", {
            aliases: ["win", "won"],
            channel: "guild",
            category: "score",
            description: "Increment player's score",
        });
    }
    args(message) {
        var _a, _b, _c;
        return tslib_1.__asyncGenerator(this, arguments, function* args_1() {
            const base = new discord_js_1.MessageEmbed()
                .setColor("RANDOM")
                .setThumbnail(config_1.default.bot.iconURL)
                .setFooter(`Requested by ${((_a = message.member) === null || _a === void 0 ? void 0 : _a.nickname) || message.author.username}`, (_b = message.member) === null || _b === void 0 ? void 0 : _b.user.displayAvatarURL({ dynamic: true }));
            const res = yield tslib_1.__await(fetch_1.fetch(`${config_1.default.api.prefix}/user/${(_c = message.member) === null || _c === void 0 ? void 0 : _c.id}/game`, "GET"));
            const games = yield tslib_1.__await(res.json());
            if (!games.length)
                return yield tslib_1.__await(message.reply("You have no games."));
            const gameTitles = games.map((game, i) => `> ${i + 1}. ${game.title}`);
            const gamePrompt = new discord_js_1.MessageEmbed(base)
                .addField("Your games", gameTitles)
                .setTitle("Choose a game.");
            let selectedGame;
            let game = yield yield tslib_1.__await({
                prompt: {
                    start: gamePrompt,
                    retry: "Not a game. Please try again.",
                    timeout: "That's a timeout.",
                    cancel: "No worries.",
                },
                type: games
                    .map((game) => game.title)
                    .concat(games.map((_, i) => (i + 1).toString())),
            });
            if (typeof +game === "number") {
                selectedGame = games[game - 1];
                game = selectedGame.title;
            }
            else {
                selectedGame = games.find((_game) => _game.title === game);
            }
            if (!selectedGame)
                return yield tslib_1.__await(message.reply("That is weird."));
            const playerNames = Object.keys(selectedGame.scores).map((e, i) => `> ${i + 1}. ${e}`);
            const playerPrompt = new discord_js_1.MessageEmbed(base)
                .setTitle("Choose a user")
                .addField("Users", playerNames);
            let player = yield yield tslib_1.__await({
                prompt: {
                    start: playerPrompt,
                    retry: "Not a user. Please retry.",
                    timeout: "That's a timeout.",
                    cancel: "No worries.",
                },
                type: Object.keys(selectedGame.scores).concat(Object.keys(selectedGame.scores).map((_, i) => (i + 1).toString())),
            });
            if (typeof +player === "number") {
                player = Object.keys(selectedGame.scores)[player - 1];
            }
            return yield tslib_1.__await({ game, player });
        });
    }
    async exec(message, args) {
        var _a;
        const badArgs = Object.values(args).some((e) => !e);
        if (badArgs)
            return;
        fetch_1.fetch(`${config_1.default.api.prefix}/user/${(_a = message.member) === null || _a === void 0 ? void 0 : _a.id}/game/${args.game}/score/${args.player}/inc`, "PATCH").then(async (res) => {
            if (!res.ok) {
                console.log(res);
                switch (res.status) {
                    case 404:
                        return message.reply("Game not found");
                        break;
                    case 409:
                        return message.reply("user is not participant");
                    default:
                        return message.reply("☠️ Under attack, get cover!");
                        break;
                }
            }
            const data = await res.json();
            const players = Object.keys(data.scores);
            const scores = players.map((p) => data.scores[p]);
            const text = players.map((val, index) => {
                return `${players[index]} has ${scores[index]}`;
            });
            const max = Math.max(...scores);
            const maxIndex = scores.findIndex((e) => e == max);
            const winnerUsername = players[maxIndex];
            return fetch_1.fetch(`${config_1.default.api.prefix}/user/${winnerUsername}`, "GET", {
                headers: { "User-Agent": "none" },
            })
                .then((res) => {
                console.log(res);
                if (!res.ok)
                    return message.reply("whoops");
                return res.json();
            })
                .then((user) => {
                var _a, _b;
                const fields = Object.entries(data.scores).map(([username, score]) => ({ name: username, value: score }));
                const GameCard = new discord_js_1.MessageEmbed()
                    .setColor("RANDOM")
                    .setThumbnail(config_1.default.bot.iconURL)
                    .setFooter(`Requested by ${((_a = message.member) === null || _a === void 0 ? void 0 : _a.nickname) || message.author.username}`, (_b = message.member) === null || _b === void 0 ? void 0 : _b.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(args.game)
                    .addFields(fields)
                    .setDescription(`> ${user.bio} ~ ${winnerUsername}`);
                return message.reply(GameCard);
                const reply = user.bio ? [...text, `> ${user.bio}`] : [...text];
                return message.reply(reply.join("\n"));
            })
                .catch((err) => console.log(err));
        });
    }
}
exports.default = WinGame;
//# sourceMappingURL=incGame.js.map