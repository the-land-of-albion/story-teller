import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import { getExtraMessage, sendNpc, sendUser } from "../util/getExtraMessage";

export type SampleMessage = Message & {
  extra: Map<string, Message>;
  sampleChannel: TextChannel,
  getExtra: typeof getExtraMessage;
  sendUser: typeof sendUser;
  sendNpc: typeof sendNpc;
};
