import { Client, Guild, Intents, Message } from "discord.js";
import { CronJob } from "cron";

import config from "./helpers/config";
import logger from "./services/logger";

import connect from "./services/db";
import { Checks } from "./types/Constants";
import * as message from "./methods/messages";
import * as boyd from "./methods/boyd";
import Currency from "./methods/currency";
import * as dianne from "./methods/dianne";
import * as rockandroll from "./methods/rockandroll";
import * as skistats from "./methods/skiStats";
import * as whatshowardupto from "./methods/whatshowardupto";
import * as kyle from "./methods/kyle";

const intents: Intents = new Intents();
intents.add(Intents.ALL);
const client: Client = new Client();

try {
	connect();
} catch (error) {
	logger.info(error);
}

const triggersAndResponses: string[][] = [
	["!loop", "no !loop please"],
	["vendor", "Don't blame the vendor!"],
	["linear", "We have to work exponentially, not linearly!"]
];

const itsTimeToRockandRoll: CronJob = new CronJob("0 0 9 * * 1", () => {
	rockandroll.itsTime(client);
}, null, null, "America/New_York");

client.on("guildCreate", (guild: Guild) => {
	guild.owner.send(`Thanks for adding me to ${guild.name}!\nCommands are very simple, just type !help in your server!`);
});

client.on("ready", async () => {
	logger.info(`Logged in as ${client.user.tag}!`);
	// client.user.setAvatar("https://cdn.discordapp.com/emojis/694721037006405742.png?v=1");
	client.user.setActivity("Farmville");
	itsTimeToRockandRoll.start();
});

client.on("message", (msg: Message) => {
	switch (true) {
	case Checks.skiStats.test(msg.content) && !msg.author.bot:
		skistats.all(msg);
		break;
	case Checks.bucksReg.test(msg.content) && !msg.author.bot:
		Currency.CheckBucks(msg, "!bucks");
		break;
	case Checks.getNobles.test(msg.content) && !msg.author.bot:
		Currency.GetNobles(msg);
		break;
	case Checks.configure.test(msg.content) && !msg.author.bot:
		Currency.Configure(client, msg);
		break;
	case Checks.townRoad.test(msg.content) && !msg.author.bot:
		boyd.townRoad(msg);
		break;
	case Checks.exitStream.test(msg.content) && !msg.author.bot:
		boyd.exitStream(msg);
		break;
	case Checks.fridayFunny.test(msg.content) && !msg.author.bot:
		dianne.fridayFunny(msg);
		break;
	case Checks.fridayFunnies.test(msg.content) && !msg.author.bot:
		dianne.fridayFunnies(msg);
		break;
	case Checks.howardUpdate.test(msg.content) && !msg.author.bot:
		whatshowardupto.howardUpdate(msg, config.GOOGLE_API_KEY, config.GOOGLE_CX_KEY);
		break;
	case msg.channel.type !== "dm" && msg.channel.name === "admin-announcements":
		message.adminMsg(msg, client);
		break;
	default:
		message.includesAndResponse(msg, triggersAndResponses);
		kyle.kyleNoWorking(msg);
		kyle.getKyleCommand(msg);
	}
});

client.on("unhandledRejection", error => {
	logger.error("Unhanded promise rejection: ", error);
});

client.login(config.BOT_TOKEN).catch(e => {
	logger.error(e);
});