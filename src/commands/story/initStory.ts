import { ArgumentGenerator, Command } from "discord-akairo";
import { Channel } from "discord.js";
import { DMChannel } from "discord.js";
import { Message } from "discord.js";
import { stringify } from "node:querystring";
import { NPC } from "./npc";

class InitStoryLine extends Command {
  constructor() {
    super("start_story", {
      aliases: ["story"],
      category: "story",
      description: "Starts random story.",
      channel: "dm",
    });
  }
  *args(message: Message) {
    /* NPCS */
    const King = new NPC({
      name: "High King Edmund",
      iconURL:
        "https://raw.githubusercontent.com/BotHaven/static/main/img/king.png",
      message,
    });
    const Pirate = new NPC({
        name: "Pirate Pete",
        iconURL: "https://raw.githubusercontent.com/BotHaven/static/main/img/pirate.png",
        message,
    })

    /* DIALOGS */

    /* Choose Class */
    const classChoices = ["Warrior", "Rouge", "Archer"]
    const classTypes = classChoices.concat(classChoices.map((_,i) =>  (i +1).toString()));
    const classFields = classChoices.map((val, i) => ({name: `${i +1}.`, value: val, inline: true}));
    const chooseCharacter = King.talk("> Who do you wish to be, if you could be anyone?")
      .addFields(classFields);
    const retryCharacter = King.talk("> Either tell me which, or tell me the corresponding number")
    let chosenCharacter = yield {
      type: classTypes,
      prompt: {
        start: chooseCharacter,
        retry: retryCharacter,
        timeout: "Rip"
        
      },
    };
    if(!isNaN(+chosenCharacter)) chosenCharacter = classChoices[chosenCharacter -1]

    /* a */
    const pirateChoices = ["attack", "run", "bargain"];
    const pirateTypes = pirateChoices.concat(pirateChoices.map((_,i) =>  (i +1).toString()));
    const pirateFields = pirateChoices.map((val, i) => ({name: `${i +1}.`, value: val, inline: true}));
    const pirateApproaches = Pirate.talk(`> Arr, what do you know. A weak old ${chosenCharacter}`)
        .addFields(pirateFields);
    const pirateRetry = Pirate.talk(`> Stop the mumbling, y'ar bloody ${chosenCharacter}`)
        .addFields(pirateFields);
    let choice = yield {
        type: pirateTypes,
        prompt: {
            start: pirateApproaches,
            retry: pirateRetry,
            timeout: "rip",
        }
    }
    if(!isNaN(+choice)) choice = pirateChoices[choice -1]
    

    return { chosenCharacter, choice };
  }
  exec(message: Message, args: any) {
      message.reply(args.chosenCharacter + args.choice);
    return;
  }
}

export default InitStoryLine;
