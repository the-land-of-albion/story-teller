import { Message, User } from "discord.js";
import { GuildMember } from "discord.js";
import { ColorResolvable } from "discord.js";
import { MessageEmbed } from "discord.js";

export class NPC {
  name: string;
  iconURL: string;
  color: ColorResolvable | string;
  message: Message;
  listener: User | GuildMember;
  constructor(options: {
    name: string;
    iconURL: string;
    color?: ColorResolvable | string;
    message: Message;
  }) {
    const { name, iconURL, color, message } = options;
    this.name = name;
    this.iconURL = iconURL;
    this.color = color || "RANDOM";
    this.message = message;
    this.listener = message.member as GuildMember;
  }

  talk(message?: string) {
    const TalkEmbed = new MessageEmbed()
      .setThumbnail(this.iconURL)
      .setAuthor(this.name)
      .setColor(this.color)
      .setDescription(message || "\u200b")
			.setFooter(`Requested by ${this.message.author.username}`, this.message.author.displayAvatarURL({dynamic: true}))

    return TalkEmbed;
  }
}
