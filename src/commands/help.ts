import { Message, MessageEmbed } from "discord.js";

import { CommandDescriptor } from "../types/Constants";
import { ICommandHandler } from "../types";
import { ErrorMessage } from "../helpers/message";

export default {
	case: "help",
	requiredArgs: false,
	arguments: [],
	properUsage: "!help",
	resolver: async (msg: Message) => {
		try {
			const helpEmbed = new MessageEmbed();
			helpEmbed.setColor("GREEN");
			helpEmbed.setTitle("Commands");
			CommandDescriptor.forEach(({ prefix, description }) => {
				helpEmbed.addField(prefix, description);
			});
			helpEmbed.setDescription("Here is a list of my commands!");
			await msg.reply({ embeds: [helpEmbed] });
		} catch (error) {
			ErrorMessage(msg, error);	
		}
	}
} as ICommandHandler;