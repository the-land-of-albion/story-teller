import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {fetch} from "../../config/fetch";
import Game from "../../util/Game";
import Options from "../../util/Options";

class NewGame extends Command {
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

  async exec(message: Message, args: Record<string, any>) {
    const game = new Game(args.game, []).build();
    fetch(`http://localhost:3000/user/${message.member?.id}/game`, "POST", {body: {title: args.game, _title: args.game.toLowerCase()}})
    .then(async (e: Response) => {
      if(e.status == 409){
        return message.reply("☠️ Ya'r know, ya'r have a game with that name!");
      }
    return message.reply(`🏴‍☠️ Ai, ya'r now tracking ${args.game}.`);
    }).catch((err) => {
      return message.reply("☠️ Ship's sinking!");
    })

  }
}

export default NewGame;
