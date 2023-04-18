import { IUser } from "btbot-types";

import { Api, Embed } from "@helpers";
import { BetAggregate, IChallengeResponse } from "@types";

export const getCurrentChallenge = async (server_id: string) => {
	const response = await Api.get<IChallengeResponse>(
		`challenges/server/${server_id}?is_active=true`
	);
	return response.challenges[0];
};

export const postCurrentChallenge = async (server_id: string) => {
	const challenge = await getCurrentChallenge(server_id);
	if (!challenge) throw "There is no current challenge!";
	const { participants } = challenge;
	const mayor = participants[0].is_mayor ? participants[0] : participants[1];
	const challenger = participants[0].is_mayor ? participants[1] : participants[0];
	let content = `<@${challenger.user_id}> has challenged mayor <@${mayor.user_id}>!\n`;
	content += "Use Command\n\n";
	const mentions = participants.map(({ user_id }) => {
		return `\`!bet\` <@${user_id}>`;
	});
	content += mentions.join(" or \n");
	content += "\nto bet on a winner\n\n";
	content += `>>> ${challenge.details}`;
	const embed = Embed.success(content, "Current Challenge");
	return embed;
};

export const buildCongratsMessage = (results: IUser[]) => {
	if (results.length <= 0) return "No one bet correctly!";
	let content = "Congratulations to:\n";
	results.forEach(({ user_id }) => {
		content += `<@${user_id}>\n`;
	});
	return (content += "\nfor their wise bets!");
};

export const buildCurrentBetsMessage = (results: BetAggregate) => {
	if (results.length <= 0) return "No one placed any bets!";
	let content = "The current bets are:\n\n";
	const participants = results.map(({ bets }) => {
		const userBets = bets.map(({ user_id, amount }) => {
			return `• <@${user_id}>:\t${amount}`;
		});
		return `<@${bets[0].user_id}>\n` + userBets.join("\n");
	});
	content += participants.join("\n\n");
	return content;
};
