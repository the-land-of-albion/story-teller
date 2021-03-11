import { MessageEmbed } from "discord.js";
import { SampleMessage } from "../interfaces/SampleMessage";

export function getExtraMessage(this: SampleMessage, name: string){
    const extra = this.extra.get(name);
    if(!extra) throw new Error("cannot get extra message");
    return extra;
}

export function sendNpc(this: SampleMessage, message: string | MessageEmbed){
    return this.getExtra("npc").edit(message);
}
export function sendUser(this: SampleMessage, message: string | MessageEmbed){
    return this.getExtra("user").edit(message);
}
