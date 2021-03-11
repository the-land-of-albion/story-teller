import { DMChannel } from "discord.js";
import { Message } from "discord.js";
import { stories } from "../../../../../client";
import { Event } from "../../../event";
import { NPC } from "../../../npc";
import { SampleMessage } from "../interfaces/SampleMessage";
import {XPFairy} from "../npcs/xpfairy.npc";
import {getUser} from "../util/getUser";
/* HELPERS */

let words2Say = "**You arrive in the north**.\n*You see a Warrior in the distance.*";
function say(){
    return words2Say;
}
/* NPCS */
let CelticWarrior = new NPC({
  name: "Celtic Warrior",
  iconURL:
    "https://raw.githubusercontent.com/BotHaven/static/main/img/celtic/png/008-warrior.png",
  color: "BLURPLE"
  });
  
/* DIALOG */
const start = (fields, message: SampleMessage) =>{
    message.sendNpc(CelticWarrior.showStats(say()).addFields(fields))
}
const retry = (fields, message: SampleMessage) =>
  {message.sendNpc(CelticWarrior.talk(
    "Well, there are only limited options.\n> Huuuga huga! AAAAAAAAARG!"
  ).addFields(fields))}
const timeout = (fields) => CelticWarrior.talk("Took too long.");
const ended = (fields) =>
  CelticWarrior.talk("When you try to so hard but you dont succeed");
const cancel = (fields) => CelticWarrior.talk("> HAHA!");

/* ACTIONS */
const choices = new Map<string, Function>();
choices.set("attack", (input, message: SampleMessage) => {
  words2Say = "> Arghhh Ya!"
  const story = stories.get("sample");
  if (!story) throw new Error("no story");
  const user = story.get(message.author.id);
  if (!user) throw new Error("no user");
   CelticWarrior.getAttacked(user);
  if (!user.isALive()) {
    CelticWarrior.isAlive = false;
    return message.sendNpc(XPFairy.talk("Hehe, you died."));
  }
  if (!CelticWarrior.isAlive) {
    user.xp = user.xp +27;
    message.sendUser(user.showStats());
    return message.sendNpc(
      XPFairy.talk("You killed the Celtic Warrior. Noice. Smoart.")
    );
  }
  message.extra.get("user")?.edit(user.showStats());
});
choices.set("run", (input, message: Message) => {
  CelticWarrior.isAlive = false;
  return message.reply(CelticWarrior.talk("AHHHHH, OOHHHH!"));
});
choices.set("wait", (input, message: SampleMessage) => {
    words2Say = "Ouuuhhhh! Arrrrrgh!"
    const user = getUser("sample",message);
    CelticWarrior.getAttacked(user);
    if (!user.isALive()) {
        CelticWarrior.isAlive = false;
        return message.sendNpc(XPFairy.talk("Hehe, you died."));
  }
    if (!CelticWarrior.isAlive) {
    user.xp = user.xp +27;
    message.sendUser(user.showStats());
        message.sendNpc(
        XPFairy.talk("You killed the Celtic Warrior. Noice. Smoart.")
        ).then((m) => {
          console.log("WHAT THE FUCK")
          m.delete({timeout: 3000})})
        return;
    }
});

export const SampleEvent3 = new Event(CelticWarrior, choices, {
  start,
  retry,
  timeout,
  ended,
  cancel,
});
