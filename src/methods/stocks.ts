import { Message } from "discord.js";

import { replyWithSuccessEmbed, replyWithErrorEmbed } from "./messages";
import { Stock } from "../models/Stock";
import { StockRepository as StockRepo } from "../repositories/StockRepository";
import { UserRepository as UserRepo } from "../repositories/UserRepository";

const api = require("yahoo-stock-prices");

/*
	!stock
	show the current price of the stock for the specified ticker symbol
*/
export const showPrice = async (msg: Message, prefix: string): Promise<void> => {
	try {
		const args: string[] = msg.content.slice(prefix.length).trim().split(" ");
		if (args[0] === "") throw "Ticker symbol required! Usage: ```!stock [tickerSymbol]```";
		const symbol: string = args[0].toUpperCase();

		try {
			const res = await getCurrentStockInfo(symbol);
			if (!res) throw `Cannot find ticker symbol: '${symbol}'!`;

			replyWithSuccessEmbed(msg, symbol, `${res.price} (${res.currency})`);
		} catch (error) {
			throw `Cannot find ticker symbol: '${symbol}'!`;
		}
	} catch (error) {
		replyWithErrorEmbed(msg, error);
	}
};

/*
	!buystock [tickerSymbol] [amount]
	buy stock in the specified ticker symbol for the given amount of billybucks
*/
export const buy = async (msg: Message, prefix: string): Promise<void> => {
	try {
		const args: string[] = msg.content.slice(prefix.length).trim().split(" ");
		if (args.length !== 2) throw "Ticker symbol and amount of BillyBucks required! Usage: ```!buystock [tickerSymbol] [amount]```";

		const symbol: string = args[0].toUpperCase();
		const amount: number = parseInt(args[1]);
		if (isNaN(amount) || amount < 1) throw "Invalid amount! Must be a positive number.";

		const user = await UserRepo.FindOne(msg.author.id, msg.guild.id);

		const alreadyInvested = await StockRepo.FindStockForUserBySymbol(msg.guild.id, user, symbol);
		if (alreadyInvested) throw `You are already invested in ${symbol}! You must sell it before buying more.`;

		if (user.billyBucks < amount) throw `Cannot invest ${amount} BillyBucks, you only have ${user.billyBucks}!`;

		const currentPrice: number = (await getCurrentStockInfo(symbol)).price;
		if (!currentPrice) throw `Cannot find ticker symbol: '${symbol}'!`;

		user.billyBucks -= amount;
		const paid = await UserRepo.UpdateOne(user);
		const bought = await StockRepo.InsertOne(msg.guild.id, user, symbol, amount, currentPrice);
		if (!paid || !bought) throw `Unexpected error encountered buying '${symbol}'!`;

		replyWithSuccessEmbed(msg, "Stock Purchased", `You invested ${amount} BillyBucks in '${symbol}'!`);
	} catch (error) {
		replyWithErrorEmbed(msg, error);
	}
};

/*
	!sellstock [tickerSymbol]
	sell all stock you own for the specified ticker symbol
*/
export const sell = async (msg: Message, prefix: string): Promise<void> => {
	try {
		const args: string[] = msg.content.slice(prefix.length).trim().split(" ");
		if (args[0] === "" || args.length !== 1) throw "Ticker symbol required! Usage: ```!sellstock [tickerSymbol]```";

		const symbol: string = args[0].toUpperCase();

		const user = await UserRepo.FindOne(msg.author.id, msg.guild.id);

		const stock = await StockRepo.FindStockForUserBySymbol(msg.guild.id, user, symbol);
		if (!stock) throw `Cannot sell '${symbol}'! You are not invested in it.`;

		const currentPrice: number = (await getCurrentStockInfo(symbol)).price;
		if (!currentPrice) throw `Cannot find ticker symbol: '${symbol}'!`;

		const multiplier: number = currentPrice / stock.boughtAtPrice;
		const sellValue: number = Math.floor(stock.billyBucksInvested * multiplier);

		user.billyBucks += sellValue;
		const sold = await UserRepo.UpdateOne(user);
		const removed = await StockRepo.RemoveOne(stock, user);
		if (!sold || !removed) throw `Unexpected error occurred selling '${symbol}'!`;

		replyWithSuccessEmbed(msg, "Stock Sold", `You sold your stock in '${symbol}' for ${sellValue} BillyBucks!`);
	} catch (error) {
		replyWithErrorEmbed(msg, error);
	}
};

/*
	!portfolio
	view info on your active investments
*/
export const portfolio = async (msg: Message): Promise<void> => {
	try {
		const user = await UserRepo.FindOne(msg.author.id, msg.guild.id);
		const stocks: Stock[] = await StockRepo.FindStocksForUser(msg.guild.id, user);
		if (!stocks || stocks.length === 0) throw "No active investments!";

		let body = "";
		for (let i = 0; i < stocks.length; i++) {
			const stock = stocks[i];

			const res = await getCurrentStockInfo(stock.tickerSymbol);
			const currentPrice: number = res.price;
			const currency: string = res.currency;

			const multiplier: number = currentPrice / stock.boughtAtPrice;
			const sellValue: number = Math.floor(stock.billyBucksInvested * multiplier);
			const netGainOrLoss: number = sellValue - stock.billyBucksInvested;

			body += `**${stock.tickerSymbol}**\n`;
			body += `Price Bought At: ${stock.boughtAtPrice} ${currency}\n`;
			body += `Current Price: ${currentPrice} ${currency}\n`;
			body += `Amount Invested: ${stock.billyBucksInvested} BillyBucks\n`;
			body += `Net Gain/Loss: ${netGainOrLoss > 0  ? "+" : ""}${netGainOrLoss} BillyBucks\n\n`;
		}

		replyWithSuccessEmbed(msg, "Stock Portfolio:", body);
	} catch (error) {
		replyWithErrorEmbed(msg, error);
	}
};

const getCurrentStockInfo = async (tickerSymbol: string): Promise<{ price: number, currency: string }> => {
	return await api.getCurrentData(tickerSymbol);
};