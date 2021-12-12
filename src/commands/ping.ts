import { Message } from "discord.js";

import { ICommandHandler } from "../Types";

export default {
	case: "ping",
	requiredArgs: false,
	arguments: [],
	properUsage: "!ping",
	resolver: async (msg: Message) => {
		await msg.reply("pong");
	}
} as ICommandHandler;