"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("path");
const PDotEnv = path.join(path.dirname(__dirname), ".env");
dotenv.config({ path: PDotEnv });
console.log(PDotEnv);
const client_1 = require("./client");
client_1.default.start();
//# sourceMappingURL=index.js.map