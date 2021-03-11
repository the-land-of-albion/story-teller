import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Worker } from "./sample/npcs/worker.npc";

export default class DeleteRoom extends Command {
  constructor(){
      super("delete room",{
          aliases: ["close"],
          description: "Closes room",
      })

  }

  exec(message: Message){
      const categoryChannel =  message.guild?.channels.cache.get("819585328037101609");
      const name = message.member?.displayName .toLocaleLowerCase()+ "-balthazar";

      const channel = message.guild?.channels.cache.find((c) => c.name === name);
      if(!channel)return;
        message.channel.send(Worker.talk("Thanks for cleaning up after yourself!"));
      setTimeout(()=> {
          channel.deletable && channel.delete();
      },7500)
  }
}