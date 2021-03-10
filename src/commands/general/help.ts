import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { MessageReaction } from "discord.js";
import { Collection } from "discord.js";
import { EmbedFieldData } from "discord.js";
import { MessageCollector } from "discord.js";
import { User } from "discord.js";
import { Message } from "discord.js";
import config from "../../config";

class Help extends Command {
  constructor() {
    super("help", {
      aliases: ["help"],
      category: "general",
      description: "Lists general command info.",
      args: [
        {
          id: "category",
          default: "default",
        },
      ],
    });
  }

  

  async exec(message: Message) {
    let SearchCollector: MessageCollector;

    /* Embeds */
    const Home = new MessageEmbed()
      .setThumbnail(
        this.client.user?.displayAvatarURL({ dynamic: true }) as string
      )
      .setColor("RANDOM")
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .addFields([
        {
          name: "🏠 | Home",
          value: "Returns here.",
        },
        {
          name: "📚 | Commands",
          value: "Shows all categories along with their commands.",
        },
        {
          name: "🔎 | Search",
          value: "Search for any command, alias or category.",
        },
        {
          name: "🔧 | Guide",
          value: "Shows you how to talk to this bot and all things you can do.",
        },
      ]);

    const Commands = new MessageEmbed()
      .setTitle("All available categories.")
      .setThumbnail(
        this.client.user?.displayAvatarURL({ dynamic: true }) as string
      )
      .setColor("RANDOM")
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .addFields([
        {
          name: "game",
          value: "> creating a game, inviting friends and deleting a game",
        },
        { name: "score", value: "> Changing score on your games." },
        { name: "general", value: "> General commands." },
      ]);

    const Search = new MessageEmbed()
      .setTitle("Search for a command via category or alias.")
      .addFields([{ name: "Type `cancel` to cancel.", value: "\u200b" }, {name: "categories to try out", value: "> game, score, general"}])
      .setThumbnail(
        this.client.user?.displayAvatarURL({ dynamic: true }) as string
      )
      .setColor("RANDOM")
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      );
    const Guides = new MessageEmbed()
    .setTitle("How to get started.")
      .setThumbnail(
        this.client.user?.displayAvatarURL({ dynamic: true }) as string
      )
      .setColor("RANDOM")
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .addFields([
        {
          name: "1. Creating a game",
          value: `> \`${config.bot.prefix} new\`\nGive it a name and **voila**.`,
        },
        {
          name: "2. Changing score",
          value: `> \`${config.bot.prefix} win\`, \`${config.bot.prefix} undo\`\nChoose from your games and tell me which user deserves it.`,
        },
        {
          name: "3. Inviting friends",
          value: `> \`${config.bot.prefix} invite\`\n If your friends are not registered yet, tell them to talk to **Sgt. Auth** first.`,
        },
      ]);
    /* Message & Collector*/
    const sentMessage: Message | undefined = await message.reply(Home);
    try {
      await sentMessage.react("🏠");
      await sentMessage.react("📚");
      await sentMessage.react("🔎");
      await sentMessage.react("🔧");
    } catch (er) {
      console.log(er);
    }

    const collector = sentMessage.createReactionCollector(
      (r: MessageReaction, u: User) => {
        return ["🏠", "📚", "🔎", "🔧"].includes(r.emoji.name) && !u.bot;
      },
      { time: 3e5 }
    );
    collector.on("collect", (r: MessageReaction, u: User) => {
      if (u.bot) return;
      if (!["🏠", "📚", "🔎", "🔧"].includes(r.emoji.name)) return;

      r.users.remove(u.id);

      switch (r.emoji.name) {
        case "🏠":
          sentMessage.edit(Home);
          if (SearchCollector?.client) SearchCollector.stop();
          break;

        case "📚":
          sentMessage.edit(Commands);
          if (SearchCollector?.client) SearchCollector.stop();
          break;
        case "🔎":
          sentMessage.edit(Search);
          SearchCollector = sentMessage.channel.createMessageCollector(
            (m: Message) => {
              return (
                !m.author.bot && !u.bot && message.author.id === m.author.id
              );
            },
            { time: 3e5 }
          );
          SearchCollector.on("collect", (m: Message) => {
            if (m.content.toLowerCase() === "cancel") {
              message.channel
                .send(
                  new MessageEmbed().setTitle("Cancelling").setColor("RANDOM")
                )
                .then((_sentMessage) => {
                  m.delete({ timeout: 1000 });
                  _sentMessage.delete({ timeout: 1500 });
                  setTimeout(() => {
                    sentMessage.edit(Home);
                  }, 1500);
                });
              return SearchCollector.stop();
            }
            let res: Collection<string, Command> = this.handler.modules.filter(
              (c) => {
                return (
                  c.categoryID.toLocaleLowerCase() ===
                    m.content.toLocaleLowerCase() ||
                  c.aliases.some((v) => {
                    return (
                      //@ts-ignore
                      v
                        .toLowerCase()
                        .match(new RegExp(m.content.toLowerCase(), "g"))
                        ?.length > 0
                    );
                  })
                );
              }
            );
            const fields: unknown = res.map((command) => ({
              name: command.id,
              value: `> Aliases: ${command.aliases
                .map((e) => `\`${config.bot.prefix} ${e}\``)
                .join(", ")}\n**${command.description}**`,
            }));
            const Result: MessageEmbed = new MessageEmbed()
              .setTitle("Search Results")
              .setColor("RANDOM");
            if (!res.first()) {
              Result.setDescription(
                "No commands or aliases have been found"
              ).addFields([
                {
                  name: "Try searching for one of the following categories",
                  value: "> game, score, general",
                },
              ]);
              try {
                sentMessage.edit(Result);
                m.delete({timeout: 1500});
                return SearchCollector.stop();
              } catch(err){};
            }
            Result.setThumbnail(
              this.client.user?.displayAvatarURL({ dynamic: true }) as string
            )
              .setFooter(
                `Requested by ${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .addFields(fields as EmbedFieldData[]);
            try {
              m.delete({ timeout: 1500 });
            sentMessage.edit(Result);
            } catch(err){}
          });
          break;

        case "🔧":
          if (SearchCollector?.client) SearchCollector.stop();
          sentMessage.edit(Guides);
          break;
      }
    });
  }
}

export default Help;
