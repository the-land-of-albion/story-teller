import { Message } from "discord.js";
import { Event } from "../../../event";
import {Rogue, Warrior, Archer, Person} from "../util/classes"
import {stories} from "../../../../../client";
import {King} from "../npcs/king.npc";
import { SampleMessage } from "../interfaces/SampleMessage";

/* DIALOG */
const start = (fields, message: SampleMessage) => {
  setTimeout(() => {
    message.sendNpc(King.talk("> Who do you wanna be?").addFields(fields))
  }, 3000);
};
const retry = (fields,message: SampleMessage) => {
  message.sendNpc(King.talk("You know, that wasn't one of the options.").addField("Options are as follows","\u200b").addFields(fields))
}
  
const timeout = (fields) => King.talk("Well, that's it for now.").addFields(fields);
const ended =(fields) =>  King.talk(
  "Are you blind? You may leave now."
);
const cancel = (fields) => King.talk("So be it.");
const success = King.talk("> As you wish.")

/* ACTIONS */
function createUserHandler(input: string, message: SampleMessage){
  const classes = new Map<string, typeof Warrior>();
  classes.set("Warrior", Warrior);
  classes.set("Archer", Archer);
  classes.set("Rogue", Rogue);

  const chosenClass = classes.get(input);
  if(!chosenClass) throw new Error("classname not found: "+input);

  function createUser(name: string){
    if(!chosenClass) return;
    const user = new chosenClass(name, message.author.id, message.author.displayAvatarURL({dynamic: true}));
    const story = stories.get("sample");
    if(!story) throw new Error("no story");
    story.set(user.oauth_id, user);
  }
  createUser(input);
  return message.sendNpc(success);
}
const choices = new Map<string, (input: string, message: SampleMessage) => any>();
choices.set("Warrior", createUserHandler);
choices.set("Archer", createUserHandler);
choices.set("Rogue", createUserHandler);

export const SampleEvent = new Event(King, choices, {
  start,
  retry,
  timeout,
  ended,
  cancel,
});
