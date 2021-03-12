import { Event } from "../../../event";
import { SampleMessage } from "../interfaces/SampleMessage";
import { Military } from "../npcs/military.npc";
import { getUser } from "../util/getUser";

let words2say = "";
function say(msg?: string){
    return words2say || msg;
}
const start = (fields, message: SampleMessage) => {
    setTimeout(()=> {
        message.sendNpc(Military.talk(say() || `> Hey ${getUser("sample",message).name} - enemy upahead, that's a big one - 9 o'clock.`).addFields(fields))
    },3000)
}
const retry = (fields, message: SampleMessage) => {
    message.sendNpc(Military.talk("> Coulndt hear you over that giant. What did you say?").addFields(fields))
}
const ended = (_, message: SampleMessage) => {
    message.reply(Military.talk("> Mhhh."));
}
const timeout = (_, message: SampleMessage) => {
    message.reply(Military.talk("> Not on top of your game to day huh?"))
}
const cancel = (_, message: SampleMessage) => {
    message.reply(Military.talk("Aight, go home."))
}

const choices = new Map<string, Function>();
choices.set("move up", function(input, message: SampleMessage){
    Military.isAlive = false;
})
choices.set("sit low", (input, message: SampleMessage) => {
    words2say = "> That was a rethorical question. Get your ass in there!";
})

export const SampleEvent4 = new Event(Military, choices, {start, retry, ended, cancel, timeout})