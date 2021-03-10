import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";
import { cachedUsers } from "../client";
import config from "../config";
import { fetch } from "../config/fetch";

class BlacklistInhibitor extends Inhibitor {
  constructor() {
    super("blacklist", {
      reason: "blacklist",
    });
  }

  async exec(message: Message) {
    return false;
    /* Validating Cache */
    if (cachedUsers.has(message.member?.id as string)) {
      return false;
    }

    try {
        /* Validating API */
        const res = await fetch(`${config.api.prefix}/user/${message.member?.id}`, "GET");
        if(!res.ok) {
            message.reply("Please create an account first.");
            return true;
        }
        /* Add to cache */
        const user = await res.json();
        cachedUsers.set(message.member?.id as string, user);
        return false;

    } catch(err){
        return true;
    }
  }
}

export default BlacklistInhibitor;
