import type { ChatInputCommandInteraction, Guild, MessageReaction } from "discord.js";

import type { BlackJackGameResponse, ISlashCommand } from "../types";
import { Api, buildBlackjackResponse } from "../helpers";
import { CommandNames } from "../types/enums";

export const blackjackStandCommand: ISlashCommand = {
	name: CommandNames.stand,
	description: "Stand in your current blackjack hand",
	handler: async (int: ChatInputCommandInteraction) => {
		const response = await stand(int.guild, int.user.id);
		await int.reply(response);
	},
	reactHandler: async (react: MessageReaction, sender_id: string) => {
		const response = await stand(react.message.guild, sender_id);
		react.message.channel.send(response);
	}
};

const stand = async (guild: Guild, user_id: string) => {
	const data = await Api.post<BlackJackGameResponse>("gamble/blackjack/stand", {
		server_id: guild.id,
		user_id
	});
	return buildBlackjackResponse(data, user_id);
};
