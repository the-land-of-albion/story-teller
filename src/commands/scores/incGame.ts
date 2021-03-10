import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import config from "../../config";
import { fetch } from "../../config/fetch";

class WinGame extends Command {
  constructor() {
    super("increment score", {
      aliases: ["win", "won"],
      channel: "guild",
      category: "score",
      description: "Increment player's score",
    });
  }

  async *args(message: Message) {
    const base = new MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(config.bot.iconURL)
      .setFooter(
        `Requested by ${message.member?.nickname || message.author.username}`,
        message.member?.user.displayAvatarURL({ dynamic: true })
      );
    const res = await fetch(
      `${config.api.prefix}/user/${message.member?.id}/game`,
      "GET"
    );
    const games: {
      _title: string;
      title: string;
      scores: Record<string, number>;
    }[] = await res.json();
    if(!games.length) return message.reply("You have no games.")
    const gameTitles = games.map((game, i) => `> ${i + 1}. ${game.title}`);
    const gamePrompt = new MessageEmbed(base)
      .addField("Your games", gameTitles)
      .setTitle("Choose a game.");
    let selectedGame: any;
    let game = yield {
      prompt: {
        start: gamePrompt,
        retry: "Not a game. Please try again.",
        timeout: "That's a timeout.",
        cancel: "No worries.",
      },
      type: games
        .map((game) => game.title)
        .concat(games.map((_, i) => (i + 1).toString())),
    };
    if (typeof +game === "number") {
      selectedGame = games[game - 1];
      game = selectedGame.title;
    } else {
      selectedGame = games.find((_game) => _game.title === game);
    }
    if (!selectedGame) return message.reply("That is weird.");
    const playerNames = Object.keys(selectedGame.scores).map(
      (e, i) => `> ${i + 1}. ${e}`
    );
    const playerPrompt = new MessageEmbed(base)
      .setTitle("Choose a user")
      .addField("Users", playerNames);
    let player = yield {
      prompt: {
        start: playerPrompt,
        retry: "Not a user. Please retry.",
        timeout: "That's a timeout.",
        cancel: "No worries.",
      },
      type: Object.keys(selectedGame.scores).concat(
        Object.keys(selectedGame.scores).map((_, i) => (i + 1).toString())
      ),
    };
    if (typeof +player === "number") {
      player = Object.keys(selectedGame.scores)[player - 1];
    }

    return { game, player };
  }

  async exec(message: Message, args: Record<string, any>) {
    const badArgs = Object.values(args).some((e) => !e);
    if (badArgs) return;

    fetch(
      `${config.api.prefix}/user/${message.member?.id}/game/${args.game}/score/${args.player}/inc`,
      "PATCH"
    ).then(async (res) => {
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

      return fetch(`${config.api.prefix}/user/${winnerUsername}`, "GET", {
        headers: { "User-Agent": "none" },
      })
        .then((res) => {
          console.log(res);
          if (!res.ok) return message.reply("whoops");
          return res.json();
        })
        .then((user) => {
          const fields = Object.entries(
            data.scores
          ).map(([username, score]) => ({ name: username, value: score }));
          const GameCard = new MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(config.bot.iconURL)
            .setFooter(
              `Requested by ${
                message.member?.nickname || message.author.username
              }`,
              message.member?.user.displayAvatarURL({ dynamic: true })
            )
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

export default WinGame;
