import { Message } from "discord.js";
import { NPC } from "../../../npc";
import { Event } from "../../../event";
import {stories} from "../../../../../client";
import { King } from "../npcs/king.npc";
import { SampleMessage } from "../interfaces/SampleMessage";
/* NPCS */


/* DIALOG */
const start = (fields, message: SampleMessage) => {
  setTimeout(()=>{
    message.sendNpc(King.talk("> What shall they call thee?").addFields(fields))
  },3000) }
const retry = (fields, message: SampleMessage) => {message.sendNpc(King.talk("> You know, that wasn't one of the options.").addFields(fields))};
const timeout = (fields) => King.talk("> Well, that's it for now.").addFields(fields);
const ended =(fields) =>  King.talk(
  "> Are you blind? You may leave now."
).addFields(fields);
const cancel = (fields) => King.talk("> So be it.").addFields(fields);
const success = (input: string) => King.talk("> As you wish "+input+"." )

/* ACTIONS */
function createUserHandler(input: string, message: SampleMessage){
  const story = stories.get("sample");
  if(!story) throw new Error("no story");
  const user = story.get(message.author.id);
  if(!user) throw new Error("no user");
  user.name = input;
  message.sendUser(user.showStats());
}
const choices = new Map<string, (input: string, message: SampleMessage) => any>();
choices.set("default", createUserHandler);

export const SampleEvent2 = new Event(King, choices, {
  start,
  retry,
  timeout,
  ended,
  cancel,
}, {type: "content", fields: []});
