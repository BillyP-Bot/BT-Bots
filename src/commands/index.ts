import { ISlashCommand } from "@types";

import { albumCommand } from "./album";
import { allowanceCommand } from "./allowance";
import { amaCommand } from "./ama";
import { betCommand } from "./bet";
import { bingCommand } from "./bing";
import { birthdayCommand } from "./birthday";
import { birthdaysCommand } from "./birthdays";
import { blackjackCommand } from "./blackjack";
import { blackjackDoubleDownCommand } from "./blackjack-double-down";
import { blackjackHitCommand } from "./blackjack-hit";
import { blackjackStandCommand } from "./blackjack-stand";
import { bucksCommand } from "./bucks";
import { buyTicketCommand } from "./buy-ticket";
import { challengeCommand } from "./challenge";
import { closeBetCommand } from "./close-bet";
import { concedeCommand } from "./concede";
import { configureCommand, configureGuildUsers } from "./configure";
import { connectFourCommand, sendConnectFourResponseMessage } from "./connect-four";
import { factCheckCommand } from "./fact-check";
import { featuresCommand, postFeature } from "./feature-request";
import { foolCommand } from "./fool";
import { helpCommand } from "./help";
import { imageCommand } from "./image";
import { lottoCommand } from "./lotto";
import { nbaCommand } from "./nba";
import { noblemenCommand } from "./noblemen";
import { payBucksCommand } from "./pay-bucks";
import { addVoiceOptionToCommandsList, sayCommand } from "./say";
import { serfsCommand } from "./serfs";
import { sheeshCommand } from "./sheesh";
import { spinCommand } from "./spin";
import { stockCommand } from "./stock";
import { buyStockCommand } from "./stock-buy";
import { portfolioCommand } from "./stock-portfolio";
import { sellStockCommand } from "./stock-sell";
import { taxesCommand } from "./taxes";

export const commands: ISlashCommand[] = [
	albumCommand,
	allowanceCommand,
	amaCommand,
	betCommand,
	bingCommand,
	birthdayCommand,
	birthdaysCommand,
	blackjackCommand,
	blackjackDoubleDownCommand,
	blackjackHitCommand,
	blackjackStandCommand,
	bucksCommand,
	buyStockCommand,
	buyTicketCommand,
	challengeCommand,
	closeBetCommand,
	concedeCommand,
	configureCommand,
	connectFourCommand,
	factCheckCommand,
	featuresCommand,
	foolCommand,
	helpCommand,
	imageCommand,
	lottoCommand,
	nbaCommand,
	noblemenCommand,
	payBucksCommand,
	portfolioCommand,
	sayCommand,
	sellStockCommand,
	serfsCommand,
	sheeshCommand,
	spinCommand,
	stockCommand,
	taxesCommand
];

export const commandsLookup = commands.reduce((acc, command) => {
	acc[command.name] = command;
	return acc;
}, {} as Record<string, ISlashCommand>);

export {
	addVoiceOptionToCommandsList,
	albumCommand,
	allowanceCommand,
	amaCommand,
	betCommand,
	bingCommand,
	birthdayCommand,
	birthdaysCommand,
	blackjackCommand,
	blackjackDoubleDownCommand,
	blackjackHitCommand,
	blackjackStandCommand,
	bucksCommand,
	buyStockCommand,
	buyTicketCommand,
	challengeCommand,
	closeBetCommand,
	concedeCommand,
	configureCommand,
	configureGuildUsers,
	connectFourCommand,
	factCheckCommand,
	featuresCommand,
	foolCommand,
	helpCommand,
	imageCommand,
	lottoCommand,
	nbaCommand,
	noblemenCommand,
	payBucksCommand,
	portfolioCommand,
	postFeature,
	sayCommand,
	sellStockCommand,
	sendConnectFourResponseMessage,
	serfsCommand,
	sheeshCommand,
	spinCommand,
	stockCommand,
	taxesCommand
};
