"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const npc_1 = require("../npc");
const sample_1 = require("./sample");
class InitStoryLine extends discord_akairo_1.Command {
    constructor() {
        super("story sample", {
            aliases: ["sample"],
            category: "story",
            description: "Starts random story.",
            channel: "dm",
        });
    }
    *args(message) {
        const tbd = yield ({ type: sample_1.SampleEvent.type, prompt: {
                start: sample_1.SampleEvent.prompt.start,
                retry: sample_1.SampleEvent.prompt.retry,
                cancel: sample_1.SampleEvent.prompt.cancel,
                timeout: sample_1.SampleEvent.prompt.cancel,
                ended: sample_1.SampleEvent.prompt.ended
            } });
        sample_1.SampleEvent.callback && sample_1.SampleEvent.callback(tbd, message);
        const tbd2 = yield ({ type: sample_1.SampleEvent2.type, prompt: {
                start: sample_1.SampleEvent2.prompt.start,
                retry: sample_1.SampleEvent2.prompt.retry,
                cancel: sample_1.SampleEvent2.prompt.cancel,
                timeout: sample_1.SampleEvent2.prompt.cancel,
                ended: sample_1.SampleEvent2.prompt.ended
            } });
        sample_1.SampleEvent2.callback && sample_1.SampleEvent2.callback(tbd2, message);
        return { tbd, tbd2 };
        /* NPCS */
        const King = new npc_1.NPC({
            name: "High King Edmund",
            iconURL: "https://raw.githubusercontent.com/BotHaven/static/main/img/king.png",
            message,
        });
        const Pirate = new npc_1.NPC({
            name: "Pirate Pete",
            iconURL: "https://raw.githubusercontent.com/BotHaven/static/main/img/pirate.png",
            message,
        });
        /* DIALOGS */
        /* Choose Class */
        const classChoices = ["Warrior", "Rogue", "Archer"];
        const classTypes = classChoices.concat(classChoices.map((_, i) => (i + 1).toString()));
        const classFields = classChoices.map((val, i) => ({ name: `${i + 1}.`, value: val, inline: true }));
        const chooseCharacter = King.talk("> Who do you wish to be, if you could be anyone?")
            .addFields(classFields);
        const retryCharacter = King.talk("> Either tell me which, or tell me the corresponding number");
        let chosenCharacter = yield {
            type: classTypes,
            prompt: {
                start: chooseCharacter,
                retry: retryCharacter,
                timeout: "Rip"
            },
        };
        if (!isNaN(+chosenCharacter))
            chosenCharacter = classChoices[chosenCharacter - 1];
        /* Pirate approaches */
        const pirateChoicesMap = new Map();
        pirateChoicesMap.set("attack", () => { });
        pirateChoicesMap.set("run", () => { message.reply("RUN BITCH RUN"); });
        pirateChoicesMap.set("bargarin", () => { });
        const pirateChoices = Array.from(pirateChoicesMap.keys());
        const pirateTypes = pirateChoices.concat(pirateChoices.map((_, i) => (i + 1).toString()));
        const pirateFields = pirateChoices.map((val, i) => ({ name: `${i + 1}.`, value: val, inline: true }));
        const pirateApproaches = Pirate.talk(`> Arr, what do you know. A weak old ${chosenCharacter}`)
            .addFields(pirateFields);
        const pirateRetry = Pirate.talk(`> Stop the mumbling, y'ar bloody ${chosenCharacter}`)
            .addFields(pirateFields);
        let choice = yield {
            type: pirateTypes,
            prompt: {
                start: pirateApproaches,
                retry: pirateRetry,
                timeout: "rip",
            }
        };
        if (!isNaN(+choice))
            choice = pirateChoices[choice - 1];
        const func = pirateChoicesMap.get(choice);
        func();
        return { chosenCharacter, choice };
    }
    exec(message, args) {
        console.log(args);
        // this.handler.register(new SampleEvent());
        // this.handler.runCommand(message, new SampleEvent(), args)
        // return;
    }
}
exports.default = InitStoryLine;
//# sourceMappingURL=sample.story.js.map