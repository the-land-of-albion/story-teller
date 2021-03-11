"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const client_1 = require("../client");
const config_1 = require("../config");
const fetch_1 = require("../config/fetch");
class BlacklistInhibitor extends discord_akairo_1.Inhibitor {
    constructor() {
        super("blacklist", {
            reason: "blacklist",
        });
    }
    async exec(message) {
        var _a, _b, _c;
        return false;
        /* Validating Cache */
        if (client_1.cachedUsers.has((_a = message.member) === null || _a === void 0 ? void 0 : _a.id)) {
            return false;
        }
        try {
            /* Validating API */
            const res = await fetch_1.fetch(`${config_1.default.api.prefix}/user/${(_b = message.member) === null || _b === void 0 ? void 0 : _b.id}`, "GET");
            if (!res.ok) {
                message.reply("Please create an account first.");
                return true;
            }
            /* Add to cache */
            const user = await res.json();
            client_1.cachedUsers.set((_c = message.member) === null || _c === void 0 ? void 0 : _c.id, user);
            return false;
        }
        catch (err) {
            return true;
        }
    }
}
exports.default = BlacklistInhibitor;
//# sourceMappingURL=blacklist.js.map