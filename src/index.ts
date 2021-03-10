import * as dotenv from "dotenv";
import * as path from "path";
const PDotEnv = path.join(path.dirname(__dirname), ".env");
dotenv.config({path:PDotEnv});
console.log(PDotEnv);
import myClient from "./client";

myClient.start();