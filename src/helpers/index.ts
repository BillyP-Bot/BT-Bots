import type { Message } from "discord.js";

import { CardSuit, Roles } from "../types/enums";
import type { BlackJackGameResponse, ICard } from "../types";
import { Api } from "./api";

export const suitLookup: Record<CardSuit, string> = {
	[CardSuit.clubs]: "♣️",
	[CardSuit.hearts]: "♥️",
	[CardSuit.spades]: "♠️",
	[CardSuit.diamonds]: "♦️"
};

export const valueLookup: Record<number, string> = {
	1: "A",
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	10: "10",
	11: "J",
	12: "Q",
	13: "K"
};

export async function updateEngagementMetrics(msg: Message) {
	const server_id = msg.guild.id;
	const mentions = msg.mentions.members.array();
	const operations = mentions.length >= 1 && mentions.reduce((acc, { user }) => {
		if (user.bot) return acc;
		if (user.id === msg.author.id) return acc;
		acc.push({
			server_id,
			user_id: user.id,
			engagement: { mentions: 1 }
		});
		return acc;
	}, []);
	const body = [
		{
			server_id,
			user_id: msg.author.id,
			engagement: { posts: 1 }
		},
		...(operations ? operations : [])
	];
	return Api.put("metrics/engagement", body);
}

export function getFirstMentionOrSelf(msg: Message, skip?: number) {
	const mentions = msg.mentions.members.array();
	if (mentions.length >= 1) return mentions[0].user.id;
	// no mentions
	const _skip = skip ? skip : msg.content.split(" ")[0].length;
	const params = msg.content.slice(_skip).trim().split(" ");
	// no valid plain text mentions
	if (params[0] === "") return msg.author.id;
	const found = msg.guild.members.cache.find(a => a.user.username.toUpperCase().trim() === params[0].toUpperCase().trim());
	if (!found) throw `could not find ${params[0]} in this server`;
	return found.user.id;
}

export async function assertMayor(msg: Message) {
	await msg.member.fetch();
	const mayorRole = msg.member.roles.cache.find(a => a.name == Roles.mayor);
	if (!mayorRole) throw "only the mayor can run this command!";
	return mayorRole;
}

export async function assertDeveloper(msg: Message) {
	await msg.member.fetch();
	const devRole = msg.member.roles.cache.find(a => a.name == Roles.developer);
	if (!devRole) throw "unauthorized";
}

export function buildReadableHand(hand: ICard[]) {
	return hand.map(({ suit, value }) => `${valueLookup[value]}${suitLookup[suit]}`);
}

export function buildBlackjackResponse(data: BlackJackGameResponse, userId: string) {
	const { player_hand, dealer_hand } = data;
	let response = `<@${userId}>: ${data.player_count}\n`;
	const readablePlayer = buildReadableHand(player_hand);
	const readableDealer = buildReadableHand(dealer_hand);
	response += `${readablePlayer.join("  ")}\n\n`;
	response += `Dealer: ${data.is_complete ? data.dealer_count : ""}\n`;
	response += `${readableDealer.join("  ")} ${data.is_complete ? "" : "🎴"}\n\n`;
	response += `Bet: ${data.wager}\n\n`;
	response += `${data.status}`;
	if (data.is_complete) {
		response += `\n\nYou now have ${data.billy_bucks} BillyBucks!`;
	}
	return response;
}

export { Api } from "./api";
export { Embed } from "./embed";