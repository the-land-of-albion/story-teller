import { Message } from "discord.js";
import { stories } from "../../../../../client";
import { Person } from "./classes";

export function getUser(storyline: string,message: Message): Person{
    const story = stories.get(storyline);
    if(!story) throw new Error("no story");
    const user = story.get(message.author.id);
    if(!user) throw new Error("no user");
    return user;
}