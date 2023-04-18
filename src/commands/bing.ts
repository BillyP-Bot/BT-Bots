import { ChatInputCommandInteraction } from "discord.js";

import { CommandNames } from "@enums";
import { ISlashCommand } from "@types";

export const bingCommand: ISlashCommand = {
	name: CommandNames.bing,
	description: "bong?",
	handler: async (int: ChatInputCommandInteraction) => {
		await int.reply("bong");
	}
};
