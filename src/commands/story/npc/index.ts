import { Message, User } from "discord.js";
import { GuildMember } from "discord.js";
import { ColorResolvable } from "discord.js";
import { MessageEmbed } from "discord.js";

export interface Stats {
  health: number;
  defense: number;
  attack: number;
}
export const BaseStats: Stats = {
  health: 100,
  defense: 1,
  attack: 10,
}
export const PirateStats: Stats = {
  health: 100,
  defense: 0.8,
  attack: 12.5,
}
export class NPC {
  name: string;
  iconURL: string;
  color: ColorResolvable | string;
  message: Message | undefined;
  // listener: User | GuildMember;
  stats: Stats;
  constructor(options: {
    name: string;
    iconURL: string;
    color?: ColorResolvable | string;
    message?: Message;
    stats?: Stats
  }) {
    const { name, iconURL, color, message, stats } = options;
    this.name = name;
    this.iconURL = iconURL;
    this.color = color || "RANDOM";
    this.message = message;
    // this.listener = message.member as GuildMember;
    this.stats = stats || BaseStats;
  }

  talk(message?: string) {
    const TalkEmbed = new MessageEmbed()
      .setThumbnail(this.iconURL)
      .setAuthor(this.name)
      .setColor(this.color)
      .setDescription(message || "\u200b")
			// .setFooter(`Requested by ${this.message.author.username}`, this.message.author.displayAvatarURL({dynamic: true}))

    return TalkEmbed;
  }
}
