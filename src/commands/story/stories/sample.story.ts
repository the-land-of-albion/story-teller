import { ArgumentGenerator, Command } from "discord-akairo";
import { GuildChannel } from "discord.js";
import { Role } from "discord.js";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Collection } from "discord.js";
import { Message } from "discord.js";
import { Worker} from "./sample/npcs/worker.npc";
import { ManufacturingArm } from "./sample/npcs/manufacturingArm.npc";

import { SampleEvent, SampleEvent2 } from "./sample";
import { SampleEvent3 } from "./sample/events/sample.3.event";
import { SampleMessage } from "./sample/interfaces/SampleMessage";
import {
  getExtraMessage,
  sendNpc,
  sendUser,
} from "./sample/util/getExtraMessage";
import { Balthazar } from "./sample/npcs/king-balthazar.npc";
import config from "../../../config";
class InitStoryLine extends Command {
  constructor() {
    super("story sample", {
      aliases: ["sample"],
      category: "story",
      description: "Starts random story.",
      channel: "guild",
    });
  }
  
  *args(message: SampleMessage) {
    /* 
    -Tips & Tricks & Conventions-
    Variables with the prefix "_" are userInputs
    */
   
    /* Validating Channel */
    message.sampleChannel = message.guild?.channels.cache.find((channel) => channel.name === message.member?.displayName.toLocaleLowerCase()+"-balthazar") as TextChannel;
    if (message.channel !== message.sampleChannel) return;

    /* Creating SampleMessage */
    message.extra = new Map<string, Message>();
    message.getExtra = getExtraMessage.bind(message);
    message.sendNpc = sendNpc.bind(message);
    message.sendUser = sendUser.bind(message);
    message.sampleChannel
      .send(Balthazar.talk("Once upon a time, there was a King that ruled in a far away land. His name was Edmund..."))
      .then((_userMessage) => message.extra.set("user", _userMessage));
    message.sampleChannel
      .send(ManufacturingArm.talk("This will take a few seconds.").setFooter("You can write \`cancel\` at any point to cancel."))
      .then((_npcMessage) => message.extra.set("npc", _npcMessage));

    /* Message Collector */
    const messageCollector = message.channel.createMessageCollector((m) => !m.author.bot, {time: 1e5});
    messageCollector.on("end", (messages: Collection<string, Message>) =>{
      console.log("end");
      messages.forEach((m)=>m.deletable && m.delete());
    })

    /* Start Storyline */
    /* Choosing Class */
    const _className = yield {
      type: SampleEvent.type,
      prompt: {
        start: SampleEvent.prompt.start,
        retry: SampleEvent.prompt.retry,
        cancel: SampleEvent.prompt.cancel,
        timeout: SampleEvent.prompt.cancel,
        ended: SampleEvent.prompt.ended,
      },
    };
    SampleEvent.callback && SampleEvent.callback(_className, message);

    /* Choose Username */
    const _name = yield {
      type: SampleEvent2.type,
      prompt: {
        start: SampleEvent2.prompt.start,
        retry: SampleEvent2.prompt.retry,
        cancel: SampleEvent2.prompt.cancel,
        timeout: SampleEvent2.prompt.cancel,
        ended: SampleEvent2.prompt.ended,
      },
    };
    SampleEvent2.callback && SampleEvent2.callback(_name, message);

    /* Monolog King */
    message.sendNpc(
      SampleEvent2.npc.talk(
        `> Look ${SampleEvent2.parseInput(
          _name
        )},\n> this is what I want you to do. We are being ambushed in the north.\n> Go to Britain, to fight along side our men.`
      )
    )
          .then(()=> {
            stopEventLoopFor(7500);
          })


    /* Combat */
    while (SampleEvent3.npc.isAlive) {
      const _attackRunWait = yield {
        type: SampleEvent3.type,
        prompt: {
          start: SampleEvent3.prompt.start,
          retry: SampleEvent3.prompt.retry,
          cancel: SampleEvent3.prompt.cancel,
          ended: SampleEvent3.prompt.ended,
          timeout: SampleEvent3.prompt.timeout,
        },
      };
      SampleEvent3.callback && SampleEvent3.callback(_attackRunWait, message);
    }

    return {
      _className,
      _name,
    };
  }

   
  exec(message: Message, args: any) {
    let embed: MessageEmbed;
    if(!args || (args && !Object.keys(args).length)){
      embed = Balthazar.talk("Ohh you gotta go? No worries, take care.") 
    } else {
      embed = Balthazar.talk("Well that's all that I remember. Hope you liked it").addField("Be sure to close the door on your way out!", `> \`${config.bot.prefix} close\` `)
    }
    setTimeout(()=> {
      message.reply(embed)
      .then((m)=>m.react("❤️"));
    },3000)
  }
}

export default InitStoryLine;

function stopEventLoopFor(ms){
  const waitTill = new Date(new Date().getTime() + ms);
  while(waitTill > new Date()){}
}