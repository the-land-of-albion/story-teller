import { EmbedFieldData, MessageEmbed } from "discord.js";
import { NPC } from "./npc";
export interface Prompt {
        start:(any, message?, message2?) => MessageEmbed | undefined | void, 
        cancel:(any, message?, message2?) => MessageEmbed | undefined | void, 
        timeout:(any, message?, message2?) => MessageEmbed | undefined | void, 
        ended:(any, message?, message2?) => MessageEmbed | undefined | void, 
        retry:(any, message?, message2?) => MessageEmbed | undefined | void, 
}
export class Event {
    choices: Map<string, Function>;
    type: string[];
    fields: EmbedFieldData[];
    prompt: Prompt;
    npc: NPC;
    constructor(npc: NPC,choices: Map<string, Function>, prompt: Prompt, options?: {type?: any, fields?: EmbedFieldData[]}){
        const {start, retry, ended, cancel, timeout} = prompt;
        this.npc = npc;
        this.choices = choices;
        this.type = options?.type || Array.from(this.choices.keys()).concat(Array.from(this.choices.keys()).map((_,i) => (i + 1).toString()));
        this.fields = options?.fields || Array.from(this.choices.keys()).map((value, index) => ({name: `${index + 1}.`, value, inline: true}));
        this.prompt = {
            start: (message, message2) => start(this.fields, message, message2),
            ended: (message, message2) => ended(this.fields, message, message2),
            timeout: (message, message2) => timeout(this.fields, message, message2),
            cancel: (message, message2) => cancel(this.fields, message, message2),
            retry: (message, message2) => retry(this.fields, message, message2),
        };
    }

    parseInput(input: string){
        if(!isNaN(+input)){
            return Array.from(this.choices.keys())[+input -1];
        } 
        return input;
    }

    callback(input: string, message?: any, message2?: any){
        const parsedInput = this.parseInput(input);
        let action;
        if(Array.from(this.choices.keys()).length === 1) {
            /* Content */
            action = this.choices.get("default");
        } else {
            /* Multiple Choice */
            action = this.choices.get(parsedInput)
        } 
        if(!action) return;

        return action(parsedInput, message, message2)
    }

}