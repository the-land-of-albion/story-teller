import { Message } from "discord.js";
import { ColorResolvable } from "discord.js";
import { MessageEmbed } from "discord.js";
import { BargainResponse } from "../stories/sample/interfaces/bargainResponse";
import { Person } from "../stories/sample/util/classes";

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
  stats: Stats;
  isAlive: boolean;
  inventory: [];
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
    this.stats = stats || BaseStats;
    this.isAlive = true;
    this.inventory = [];
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
  showStats(message?: string ){
    const myStats = Object.entries(this.stats).map(([name, value]: [string, number]) => ({name,value: value.toFixed(2),inline: true}));
    const StatEmbed = this.talk(message)
      .addFields(myStats);
      return StatEmbed;

  }
  getAttacked(user: Person){
    user.health = user.health - this.stats.attack * user.defense;
    this.stats.health = this.stats.health - user.attack * this.stats.defense;
    this.isAlive = this.stats.health > 0 ? true : false;

    return this;
  }
  bargainWith(user: Person): BargainResponse{
    const base = { intrigued : false, item: null}
    if(!this.inventory.length) return base;
    
    const intrigued = Math.round(Math.random());
    if(!intrigued) {
      user.health = user.health - this.stats.attack * user.defense;
      return base;
    }

    const randomItemInInventory = this.inventory[Math.floor(Math.random()*this.inventory.length)];
    return {...base, item: randomItemInInventory}
  }
}
