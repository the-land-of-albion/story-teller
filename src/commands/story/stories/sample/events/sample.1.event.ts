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
const start = (fields) => King.talk("Who do you wanna be?").addFields(fields);
const retry = (fields) => King.talk("You know, that wasn't one of the options.").addFields(fields);
const timeout = (fields) => King.talk("Well, that's it for now.").addFields(fields);
const ended =(fields) =>  King.talk(
  "Are you blind? You may leave now."
).addFields(fields);
const cancel = (fields) => King.talk("So be it.").addFields(fields);
const success = King.talk("As you wish.")

/* ACTIONS */
function createUserHandler(input: string, message: Message){
  const classes = new Map<string, typeof Warrior>();
  classes.set("Warrior", Warrior);
  classes.set("Archer", Archer);
  classes.set("Rogue", Rogue);

  const chosenClass = classes.get(input);
  if(!chosenClass) throw new Error("classname not found: "+input);

  function createUser(name: string){
    if(!chosenClass) return;
    const user = new chosenClass(name, message.author.id);
    stories.get("sample").set(user.oauth_id, user);
  }
  createUser(input);
  return message.reply(success);
}
const choices = new Map<string, (input: string, message: Message) => any>();
choices.set("Warrior", createUserHandler);
choices.set("Archer", createUserHandler);
choices.set("Rogue", createUserHandler);

export const SampleEvent = new Event(choices, {
  start,
  retry,
  timeout,
  ended,
  cancel,
});
