/* eslint-disable no-unused-vars */
import { config } from "@helpers";

export enum Roles {
	developer = "811639239501414420",
	mayor = "692755096462950420",
	fool = "789626084323885066"
}

export enum Emotes {
	billy_buck = "billybuck"
}

export enum Colors {
	red = "#ff6666",
	green = "#00e64d"
}

export enum Images {
	billyBuck = "https://cdn.discordapp.com/attachments/734145168776757429/812553027856236605/BullyBuck.png",
	billyMad = "https://cdn.discordapp.com/emojis/694721037006405742.png?v=1"
}

export enum Activities {
	farmville = "Farmville"
}

export enum Channels {
	adminAnnouncements = "811639445514092564",
	bot = "738194989917536317",
	botTesting = "975795297257136189",
	general = "689463685571149933"
}

export enum CommandNames {
	album = "album",
	allowance = "allowance",
	ama = "ama",
	bet = "bet",
	bing = "bing",
	birthday = "birthday",
	birthdays = "birthdays",
	blackjack = "blackjack",
	bucks = "bucks",
	buystock = "buystock",
	challenge = "challenge",
	clearqueue = "clearqueue",
	closebet = "closebet",
	concede = "concede",
	configure = "configure",
	connectfour = "connectfour",
	doubledown = "doubledown",
	factcheck = "factcheck",
	feature = "feature",
	fool = "fool",
	help = "help",
	hit = "hit",
	image = "image",
	lotto = "lotto",
	nba = "nba",
	noblemen = "noblemen",
	p = "p",
	pay = "pay",
	portfolio = "portfolio",
	queue = "queue",
	say = "say",
	sellstock = "sellstock",
	serfs = "serfs",
	sheesh = "sheesh",
	skip = "skip",
	spin = "spin",
	stand = "stand",
	stock = "stock",
	taxes = "taxes",
	ticket = "ticket"
}

export const VoiceURLs = {
	voices: `https://odqojfjkv5.execute-api.us-east-1.amazonaws.com/api/voices/server/${config.SERVER_ID}`,
	outputs: "https://odqojfjkv5.execute-api.us-east-1.amazonaws.com/api/outputs"
};
