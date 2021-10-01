import { Message, MessageEmbed } from "discord.js";

import { Colors } from "../types/Constants";
import { Loan } from "../models/Loan";
import { LoanRepository as LoanRepo } from "../repositories/LoanRepository";
import { UserRepository as UserRepo } from "../repositories/UserRepository";

export const getActiveLoanInfo = async (msg: Message): Promise<void> => {
	try {
		const user = await UserRepo.FindOne(msg.author.id, msg.guild.id);
		const loan = await LoanRepo.FindActiveLoanForUser(user, msg.guild.id);
		if (!loan) throw "No active loan!";

		msg.reply("Here is some info on your active loan:\n\n" + 
		showLoanInfo(loan)
		);
	} catch (error) {
		replyWithErrorEmbed(msg, error);
	}
};

export const bookNewLoan = async (msg: Message, prefix: string): Promise<void> => {
	try {
		const args: string[] = msg.content.slice(prefix.length).trim().split(" ");
		const amount = parseInt(args[0]);
		if (!amount || isNaN(amount)) throw "Invaid amount format!";

		const user = await UserRepo.FindOne(msg.author.id, msg.guild.id);
		if (user.hasActiveLoan) throw "You already have an active loan!";

		const minPaymentAmt = calculateMinPaymentAmount(amount);
		const creditLimitAndInterestRateInfo = calculateCreditLimitAndInterestRate(user.creditScore);
		const interestRate = creditLimitAndInterestRateInfo.interestRate;
		const creditLimit = creditLimitAndInterestRateInfo.creditLimit;

		if (amount < 100) throw "100 BillyBucks is the minimum loan amount!";
		if (amount > creditLimit) throw `Amount too high! Your credit limit is ${creditLimit} BillyBucks.`;

		const newLoan = await LoanRepo.InsertOne({ userId: msg.author.id, serverId: msg.guild.id, amount: amount, interestRate: interestRate, minPaymentAmt: minPaymentAmt }, user);
		if (newLoan) {
			msg.reply(`You booked a new loan for ${amount} BillyBucks! You now have ${user.billyBucks} BillyBucks!\n\n` + showLoanInfo(newLoan));
		}
	} catch (error) {
		replyWithErrorEmbed(msg, error);
	}
};

export const getCreditScoreInfo = async (msg: Message): Promise<void> => {
	try {
		const user = await UserRepo.FindOne(msg.author.id, msg.guild.id);
		const creditLimitAndInterestRateInfo = calculateCreditLimitAndInterestRate(user.creditScore);
		const interestRate = creditLimitAndInterestRateInfo.interestRate;
		const creditLimit = creditLimitAndInterestRateInfo.creditLimit;

		msg.reply(`Your credit score of ${user.creditScore} allows you an interest rate of ${interestRate * 100}% and a credit limit of ${creditLimit} BillyBucks!`);
	} catch (error) {
		replyWithErrorEmbed(msg, error);
	}
};

export const payActiveLoan = async (msg: Message, prefix: string): Promise<void> => {
	try {
		const args: string[] = msg.content.slice(prefix.length).trim().split(" ");
		let amount = parseInt(args[0]);
		if (!amount || isNaN(amount)) throw "Invaid amount format!";

		const user = await UserRepo.FindOne(msg.author.id, msg.guild.id);
		const loan = await LoanRepo.FindActiveLoanForUser(user, msg.guild.id);

		if (!loan) throw "No active loan!";
		if (amount > user.billyBucks) throw `Can't pay ${amount}! You only have ${user.billyBucks} BillyBucks.`;
		if (amount < loan.minPaymentAmt) throw `Not enough! The minimum required payment is ${loan.minPaymentAmt} BillyBucks!`;

		let paidOff = false;
		if (amount >= loan.outstandingBalanceAmt) {
			amount = loan.outstandingBalanceAmt;
			paidOff = true;
		}
			
		const paid = await LoanRepo.MakePayment(loan, user, amount);
		if (paid) {
			let message;
			if (paidOff) {
				message = `You paid off the outstanding balance (${amount} BillyBucks) of your active loan and closed it out! Congratulations! You now have ${user.billyBucks} BillyBucks.\n\n`;
			} else {
				message = `You made a payment of ${amount} BillyBucks toward your active loan! Well done! You now have ${user.billyBucks} BillyBucks.\n\n` + showLoanInfo(loan);
			}
			msg.reply(message);
		}

	} catch (error) {
		replyWithErrorEmbed(msg, error);
	}
};

export const nightlyCycle = async (serverId: string): Promise<void> => {
	const loans = await LoanRepo.FindAllActiveLoans(serverId);
	const now = new Date();
	loans.forEach(async loan => {
		let save = false;

		if (now > loan.nextPaymentDueDate) {
			const penalty = Math.floor(loan.originalBalanceAmt * 0.05);
			loan.penaltyAmt += penalty;
			loan.outstandingBalanceAmt += penalty;

			loan.nextPaymentDueDate.setDate(loan.nextInterestAccrualDate.getDate() + 7);

			save = true;
		}

		if (now >= loan.nextInterestAccrualDate) {
			const interestAmt = Math.floor(loan.outstandingBalanceAmt * loan.interestRate);
			loan.interestAccruedAmt += interestAmt;
			loan.outstandingBalanceAmt += interestAmt;

			loan.nextInterestAccrualDate.setDate(loan.nextInterestAccrualDate.getDate() + 7);

			save = true;
		}

		if (save) await loan.save();
	});
};

const calculateCreditLimitAndInterestRate = (creditScore: number): any => {
	if (creditScore) return { interestRate: 0.05, creditLimit: 2000 };
};

const calculateMinPaymentAmount = (amount: number): number => {
	return Math.floor(amount / 10);
};

const showLoanInfo = (loan: Loan): string => {
	return `Current Loan Balance: ${loan.outstandingBalanceAmt}\n` + 
	`Original Loan Balance: ${loan.originalBalanceAmt}\n` + 
	`Interest Rate: ${loan.interestRate * 100}%\n` + 
	`Interest Accrued: ${loan.interestAccruedAmt}\n` + 
	`Late Payment Penalty Amount: ${loan.penaltyAmt}\n` + 
	`Date Opened: ${formatDate(loan.createdAt)}\n` + 
	`Next Interest Accrual Date: ${formatDate(loan.nextInterestAccrualDate)}\n` + 
	`Next Payment Due Date: ${formatDate(loan.nextPaymentDueDate)}\n` +
	`Minimum Payment: ${loan.minPaymentAmt}`;
};

const replyWithErrorEmbed = (msg: Message, error: any): void => {
	const errorEmbed: MessageEmbed = new MessageEmbed();
	errorEmbed.setColor(Colors.red).setTitle("Error");
	errorEmbed.setDescription(error);
	msg.reply(errorEmbed);
};

const formatDate = (date : Date): string => {
	return new Date(date.getTime()).toLocaleDateString();
};