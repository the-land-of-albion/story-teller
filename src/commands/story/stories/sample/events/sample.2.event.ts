import { Message } from "discord.js";
import { NPC } from "../../../npc";
import { Event } from "../../../event";
import {Rogue, Warrior, Archer, Person} from "../util/classes"
import {stories} from "../../../../../client";

/* NPCS */
const King = new NPC({
  name: "High King Edmund",
  iconURL:
    "https://raw.githubusercontent.com/BotHaven/static/main/img/king.png",
});

/* DIALOG */
const start = (fields) => King.talk("What shall they call the?").addFields(fields);
const retry = (fields) => King.talk("You know, that wasn't one of the options.").addFields(fields);
const timeout = (fields) => King.talk("Well, that's it for now.").addFields(fields);
const ended =(fields) =>  King.talk(
  "Are you blind? You may leave now."
).addFields(fields);
const cancel = (fields) => King.talk("So be it.").addFields(fields);
const success = (input: string) => King.talk("As you wish "+input+"." )

/* ACTIONS */
function createUserHandler(input: string, message: Message){
  return message.reply(success(input));
}
const choices = new Map<string, (input: string, message: Message) => any>();
choices.set("default", createUserHandler);

export const SampleEvent2 = new Event(choices, {
  start,
  retry,
  timeout,
  ended,
  cancel,
}, {type: "content", fields: []});
