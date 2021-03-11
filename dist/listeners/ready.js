"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const config_1 = require("../config");
class ReadyListener extends discord_akairo_1.Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }
    exec() {
        console.log(`${config_1.default.bot.name} to your service.`);
    }
}
exports.default = ReadyListener;
//# sourceMappingURL=ready.js.map