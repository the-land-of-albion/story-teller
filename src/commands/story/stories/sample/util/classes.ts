import { ColorResolvable } from "discord.js";
import { MessageEmbed } from "discord.js";

export class Person {
    name: string;
    health: number;
    defense: number;
    attack: number;
    oauth_id: string;
    iconURL: string;
    className: string;
    xp: number;
    selectedTitle: number;
    titles: string[];
    color: ColorResolvable;
    constructor(options: {stats: {health: number, defense: number, attack: number}, name: string, oauth_id: string, iconURL: string, color}){
        const {health, defense, attack} = options.stats;
        const {name, oauth_id, iconURL, color} = options;
        this.health = health;
        this.defense = defense;
        this.attack = attack;
        this.name = name;
        this.oauth_id = oauth_id;
        this.iconURL = iconURL;
        this.color = color || "BLUE";

        this.titles = ["Adventurer"]
        this.selectedTitle = 0;

        this.className = this.constructor.name;
        this.xp = 0;
    }
    isALive(){
        return this.health > 0 ? true : false;
    }

    level(){
        return Math.floor(this.xp / 25);
    }

    talk(message?: string){
        const TalkEmbed = new MessageEmbed()
      .setThumbnail(this.iconURL)
      .setAuthor(this.name)
      .setColor(this.color)
      .setDescription(message || "\u200b")
      return TalkEmbed;
    }
    showStats(){
        const statsFields = Object.entries(this).filter(([name,value])=>["health","defense", "attack"].includes(name.toLocaleLowerCase())).map(([name,value]) => ({name,value,inline: true}))
        return this.talk()
            .addFields([{name: "Class:", value: this.className, inline: true}, {name: "Title:", value: this.titles[this.selectedTitle], inline: true},
            {name: "Level", value: this.level(), inline: true}, {name: "XP", value: this.xp, inline: true}
        ])
            .addFields(statsFields);
            
    }

}
export class Rogue extends Person{
    constructor(name: string, oauth_id: string, iconURL, color?){
        super({ stats: {health: 100, defense: 0.85, attack: 12.5}, name, oauth_id, iconURL, color})
    }
}

export class Warrior extends Person{
    constructor(name: string, oauth_id: string, iconURL, color?){
        super({ stats: {health: 100, defense: 0.95, attack: 18.25}, name, oauth_id, iconURL, color})
    }
}
export class Archer extends Person{
    constructor(name: string, oauth_id: string, iconURL, color?){
        super({ stats: {health: 100, defense: 0.8, attack: 23.0}, name, oauth_id, iconURL, color})
    }
}