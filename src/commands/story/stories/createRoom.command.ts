import { Command } from "discord-akairo";
import { EmbedFieldData } from "discord.js";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import config from "../../../config";

export default class CreateRoom extends Command {
    constructor(){

        super("create room", {
            description: "create room",
            aliases: ["room", "create"]
        })
    }

    *args(){

    }

    async exec(message: Message){
        /* Base */
        const categoryChannel =  message.guild?.channels.cache.get("819585328037101609");
        const name = message.member?.displayName .toLocaleLowerCase()+ "-balthazar";

        /* Create Channel */
        const newChannel = await message.guild?.channels.create(name, {parent: categoryChannel, topic: `${config.bot.prefix} stories`})

        /* Add User To Channel */
        await newChannel?.updateOverwrite(message.author, {
          SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ADD_REACTIONS: true, VIEW_CHANNEL: true
        })

        /* Collector */
        const collectorLifetime = 3e5;
        const channelCollector = newChannel?.createMessageCollector((m) => !m.author.bot, { time: collectorLifetime})
        let isUsed = false;
        channelCollector?.on("collect", (m) => {
            isUsed=true;
        })
        setTimeout(()=>{
            if(isUsed) return;
            newChannel?.delete();
            const embed = new MessageEmbed()
                .setTitle("Deleted room.")
                .setDescription("Turns out you didnt come by my room within the last "+(collectorLifetime / 1000) +"seconds so I thought, I'll just go.")
                .setAuthor(config.bot.name,config.bot.iconURL);
            message.author.send(embed);
        },collectorLifetime)

        /* First Message */
        const stories = this.handler.categories.get("story")?.map((command, key) => ({name: command.aliases.join(", "), value: `> ${command.description}`}));
        const embed = new MessageEmbed()
            .setAuthor(config.bot.name, config.bot.iconURL)
            .setTitle("Stories")
            .setDescription(`Just do \`${config.bot.prefix} <story>\``)
            .addField("**Stories:**","\u200b")
            .addFields(stories as EmbedFieldData[]) 
        newChannel?.send(embed);
    }
}