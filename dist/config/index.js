"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { NODE_ENV } = process.env;
const prefix = NODE_ENV == "production" ? "!king" : "?king";
exports.default = {
    bot: {
        prefix,
        name: "King Balthazar",
        iconURL: "https://raw.githubusercontent.com/BotHaven/static/main/img/three-wise-men/baltazar.png"
    },
    api: {
        prefix: "http://localhost:3000"
    }
};
//# sourceMappingURL=index.js.map