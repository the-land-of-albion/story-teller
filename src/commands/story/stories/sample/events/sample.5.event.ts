import { Event } from "../../../event";
import { NPC } from "../../../npc";
import { SampleMessage } from "../interfaces/SampleMessage";
import { XPFairy } from "../npcs/xpfairy.npc";
import { getUser } from "../util/getUser";

const Dagda = new NPC({name: "Dagda", iconURL: "https://raw.githubusercontent.com/BotHaven/static/main/img/celtic/png/031-dagda.png", color: "GREEN", stats: {
    attack: 22,
    defense: 0.5,
    health: 125,
}})
let words2say = "> Ougha ougha!"
function say(message?: string){
    return message || words2say;
}
const start = (fields, message: SampleMessage) => {
    message.sendNpc(Dagda.showStats(say()).addFields(fields))
}
const retry = (fields, message: SampleMessage) => {
    message.sendNpc(Dagda.talk("That was not one of the options").addFields(fields))
}
const timeout = () => {}
const cancel = () => {}
const ended = () => {}

const choices = new Map<string, Function>();
choices.set("attack", (input, message: SampleMessage) => {
    const user = getUser("sample",message);
    Dagda.getAttacked(user);
    if(!user.isALive()){
        Dagda.isAlive = false;
    }
    message.sendUser(user.showStats());
    message.sendNpc(Dagda.showStats());
})
choices.set("run", (input, message: SampleMessage) => {
    Dagda.isAlive = false;
    message.reply(Dagda.talk("> ARGGGH!"));
})
choices.set("bargain", (input, message: SampleMessage) => {
    const user = getUser("sample", message);
    const {intrigued, item} = Dagda.bargainWith(user);
    if(intrigued){
        user.inventory.push(item);
        message.reply(XPFairy.talk(`You just gained a ${item.name}`).setThumbnail(item.iconURL));
    }
    message.sendUser(user.showStats());
    message.sendNpc(Dagda.showStats());
})

const prompt = {start, retry, timeout, cancel, ended};

export const SampleEvent5 = new Event(Dagda, choices, prompt) 