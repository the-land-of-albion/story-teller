"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleEvent2 = void 0;
const npc_1 = require("../../../npc");
const event_1 = require("../../../event");
/* NPCS */
const King = new npc_1.NPC({
    name: "High King Edmund",
    iconURL: "https://raw.githubusercontent.com/BotHaven/static/main/img/king.png",
});
/* DIALOG */
const start = (fields) => King.talk("What shall they call the?").addFields(fields);
const retry = (fields) => King.talk("You know, that wasn't one of the options.").addFields(fields);
const timeout = (fields) => King.talk("Well, that's it for now.").addFields(fields);
const ended = (fields) => King.talk("Are you blind? You may leave now.").addFields(fields);
const cancel = (fields) => King.talk("So be it.").addFields(fields);
const success = (input) => King.talk("As you wish " + input + ".");
/* ACTIONS */
function createUserHandler(input, message) {
    return message.reply(success(input));
}
const choices = new Map();
choices.set("default", createUserHandler);
exports.SampleEvent2 = new event_1.Event(choices, {
    start,
    retry,
    timeout,
    ended,
    cancel,
}, { type: "content", fields: [] });
//# sourceMappingURL=sample.2.event.js.map