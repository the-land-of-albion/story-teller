import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";
import { cachedUsers } from "../client";
import { SgtAuth } from "../commands/story/stories/sample/npcs/sgt-auth.npc";
import config from "../config";
import { fetch } from "../config/fetch";

class BlacklistInhibitor extends Inhibitor {
  constructor() {
    super("blacklist", {
      reason: "blacklist",
    });
  }

  async exec(message: Message) {
    /* Validating Cache */
    if (cachedUsers.has(message.member?.id as string)) {
      return false;
    }

    try {
        /* Validating API */
        const res = await fetch(`${config.api.prefix}/user/${message.member?.id}`, "GET");
        if(!res.ok) {
            message.reply(SgtAuth.talk("Please create an account first.").addField(`How?`,`> do \`!auth help\` for more information.\n*Be sure to checkout the guide!*`));
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
