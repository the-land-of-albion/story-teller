import { EmbedFieldData, MessageEmbed } from "discord.js";
export interface Prompt {
        start:(any) => MessageEmbed, 
        cancel:(any) => MessageEmbed, 
        timeout:(any) => MessageEmbed, 
        ended:(any) => MessageEmbed, 
        retry:(any) => MessageEmbed, 
}
export class Event {
    choices: Map<string, Function>;
    type: string[];
    fields: EmbedFieldData[];
    prompt: Prompt;
    constructor(choices: Map<string, Function>, prompt: Prompt, options?: {type?: any, fields?: EmbedFieldData[]}){
        const {start, retry, ended, cancel, timeout} = prompt;
        this.choices = choices;
        this.type = options?.type || Array.from(this.choices.keys()).concat(Array.from(this.choices.keys()).map((_,i) => (i + 1).toString()));
        this.fields = options?.fields || Array.from(this.choices.keys()).map((value, index) => ({name: `${index + 1}.`, value, inline: true}));
        this.prompt = {
            start: () => start(this.fields),
            ended: () => ended(this.fields),
            timeout: () => timeout(this.fields),
            cancel: () => cancel(this.fields),
            retry: () => retry(this.fields),
        };
    }

    parseInput(input: string){
        if(!isNaN(+input)){
            return Array.from(this.choices.keys())[+input -1];
        } 
        return input;
    }

    callback(input: string, extra?: any){
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

        return action(parsedInput, extra)
    }

}