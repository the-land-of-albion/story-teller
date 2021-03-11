"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleEvent = void 0;
const npc_1 = require("../../../npc");
const event_1 = require("../../../event");
const classes_1 = require("../util/classes");
const client_1 = require("../../../../../client");
/* NPCS */
const King = new npc_1.NPC({
    name: "High King Edmund",
    iconURL: "https://raw.githubusercontent.com/BotHaven/static/main/img/king.png",
});
/* DIALOG */
const start = (fields) => King.talk("Who do you wanna be?").addFields(fields);
const retry = (fields) => King.talk("You know, that wasn't one of the options.").addFields(fields);
const timeout = (fields) => King.talk("Well, that's it for now.").addFields(fields);
const ended = (fields) => King.talk("Are you blind? You may leave now.").addFields(fields);
const cancel = (fields) => King.talk("So be it.").addFields(fields);
const success = King.talk("As you wish.");
/* ACTIONS */
function createUserHandler(input, message) {
    const classes = new Map();
    classes.set("Warrior", classes_1.Warrior);
    classes.set("Archer", classes_1.Archer);
    classes.set("Rogue", classes_1.Rogue);
    const chosenClass = classes.get(input);
    if (!chosenClass)
        throw new Error("classname not found: " + input);
    function createUser(name) {
        if (!chosenClass)
            return;
        const user = new chosenClass(name, message.author.id);
        client_1.stories.get("sample").set(user.oauth_id, user);
    }
    createUser(input);
    return message.reply(success);
}
const choices = new Map();
choices.set("Warrior", createUserHandler);
choices.set("Archer", createUserHandler);
choices.set("Rogue", createUserHandler);
exports.SampleEvent = new event_1.Event(choices, {
    start,
    retry,
    timeout,
    ended,
    cancel,
});
//# sourceMappingURL=sample.1.event.js.map