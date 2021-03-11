"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    constructor(choices, prompt, options) {
        const { start, retry, ended, cancel, timeout } = prompt;
        this.choices = choices;
        this.type = (options === null || options === void 0 ? void 0 : options.type) || Array.from(this.choices.keys()).concat(Array.from(this.choices.keys()).map((_, i) => (i + 1).toString()));
        this.fields = (options === null || options === void 0 ? void 0 : options.fields) || Array.from(this.choices.keys()).map((value, index) => ({ name: `${index + 1}.`, value, inline: true }));
        this.prompt = {
            start: () => start(this.fields),
            ended: () => ended(this.fields),
            timeout: () => timeout(this.fields),
            cancel: () => cancel(this.fields),
            retry: () => retry(this.fields),
        };
    }
    parseInput(input) {
        if (!isNaN(+input)) {
            return Array.from(this.choices.keys())[+input - 1];
        }
        return input;
    }
    callback(input, extra) {
        const parsedInput = this.parseInput(input);
        let action;
        if (Array.from(this.choices.keys()).length === 1) {
            /* Content */
            action = this.choices.get("default");
        }
        else {
            /* Multiple Choice */
            action = this.choices.get(parsedInput);
        }
        if (!action)
            return;
        return action(parsedInput, extra);
    }
}
exports.Event = Event;
//# sourceMappingURL=event.js.map