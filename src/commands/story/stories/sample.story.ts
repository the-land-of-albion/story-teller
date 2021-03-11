import { ArgumentGenerator, Command } from "discord-akairo";
import { Message } from "discord.js";
import { NPC } from "../npc";
import { SampleEvent, SampleEvent2 } from "./sample";

class InitStoryLine extends Command {
  constructor() {
    super("story sample", {
      aliases: ["sample"],
      category: "story",
      description: "Starts random story.",
      channel: "dm",
    });
  }
  *args(message: Message) {
    const tbd = yield ({type: SampleEvent.type, prompt: {
      start: SampleEvent.prompt.start,
      retry: SampleEvent.prompt.retry,
      cancel: SampleEvent.prompt.cancel,
      timeout: SampleEvent.prompt.cancel,
      ended: SampleEvent.prompt.ended
    }})
    SampleEvent.callback && SampleEvent.callback(tbd, message);
    
    const tbd2 = yield ({type: SampleEvent2.type, prompt: {
      start: SampleEvent2.prompt.start,
      retry: SampleEvent2.prompt.retry,
      cancel: SampleEvent2.prompt.cancel,
      timeout: SampleEvent2.prompt.cancel,
      ended: SampleEvent2.prompt.ended
    }})
    SampleEvent2.callback && SampleEvent2.callback(tbd2, message);
    return {tbd, tbd2};

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
    const classChoices = ["Warrior", "Rogue", "Archer"]
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

    /* Pirate approaches */
    const pirateChoicesMap = new Map<string, (a: any) => any>()
    pirateChoicesMap.set("attack", () => {})
    pirateChoicesMap.set("run", () => {message.reply("RUN BITCH RUN")})
    pirateChoicesMap.set("bargarin", () => {})
    const pirateChoices = Array.from(pirateChoicesMap.keys());
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
    const func = pirateChoicesMap.get(choice)as () => any;
    func();

    return { chosenCharacter, choice };
  }
  exec(message: Message, args: any) {
    console.log(args)
    // this.handler.register(new SampleEvent());
    // this.handler.runCommand(message, new SampleEvent(), args)
    // return;
  }
}

export default InitStoryLine;
