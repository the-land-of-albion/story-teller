import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { MessageReaction } from "discord.js";
import { Collection } from "discord.js";
import { EmbedFieldData } from "discord.js";
import { MessageCollector } from "discord.js";
import { User } from "discord.js";
import { Message } from "discord.js";
import config from "../../config";

class Help extends Command {
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

  

  async exec(message: Message) {

    /* Embeds */
    const Help = new MessageEmbed()
      .setTitle("I am an old man now, all I can do is tell my tales.")
      .setThumbnail(
        this.client.user?.displayAvatarURL({ dynamic: true }) as string
      )
      .setColor("RANDOM")
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .addFields([
        {
          name: "To listen to a story of mine:",
          value: `> Go to the \`#post-office\` and do  \`${config.bot.prefix} room\``,
        },
      ])

      return message.author.createDM().then((channel) => channel.send(Help));
  }
}

export default Help;
