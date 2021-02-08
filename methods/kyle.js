/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const fetch = require('node-fetch');
const getColors = require('get-image-colors');
const logger = require('../services/logger');

const judeId = '349605538532818944';
const discordMsgLmt = 1200;

const drinkPrefix = '!drink ';
const drinkSearchPrefix = '!searchDrinks ';
const ingredientPrefix = '!ingredients ';
const categoryPrefix = '!category ';

const kyleNoWorking = function (msg) {
	if (!msg.channel.type === 'dm' && msg.member.roles.cache.find(r => r.name === 'FormerPartnerIncorporated') && msg.channel.name === 'work-stuff') {
		msg.react(msg.guild.emojis.cache.find(e => e.name === 'BillyMad'))
			.then(logger.info)
			.catch(logger.error);
	}
};

const getApi = endpoint => {
	return new Promise((resolve, reject) => {
		fetch(`https://cocktails-heroku.herokuapp.com/cocktails/${endpoint}`)
			.then(r => r.json())
			.then(data => {
				return resolve(data);
			}).catch(e => {
				reject(e);
			});
	});
};

const getKyleCommand = function (msg) {
	/*
	if(msg.content.startsWith(drinkSearchPrefix) && msg.author.id == judeId && dropReg.test(msg.content)) {
		msg.reply(`${scaryResponse}\n'db.Collection(fg876h89f0n98hgn9)' dropped`);
		return;
	};
	*/
	if (msg.content.startsWith(drinkSearchPrefix) && !msg.author.bot) {
		const command = msg.content.replace(drinkSearchPrefix, '').replace(' ', '%20');
		const drinkName = command.replace('%20', ' ');
		// fetch
		getApi(`drink-search/?drink=${command}`)
			.then(returnedDrinks => {
				let addedDrinks = 0;
				let messageReply = `Here is the list of drinks with ${drinkName} in the name!\n`;
				for (let i = 0;
					(i < returnedDrinks.length) && (messageReply.length < discordMsgLmt); i++) {
					messageReply += returnedDrinks[i].drink + '\n';
					addedDrinks += 1;
				}
				if (returnedDrinks.length > addedDrinks) {
					messageReply += '\n... Too many to list them all! Discord limits my message size :( \n';
				}
				messageReply += '\nRequest ingredients and instructions by typing ' + drinkPrefix + ' followed by the desired drink name!';
				msg.reply(messageReply);
			});
	} else if (msg.content.startsWith(drinkPrefix) && !msg.author.bot && !msg.content.startsWith(drinkSearchPrefix)) {
		const command = msg.content.replace(drinkPrefix, '').replace(' ', '%20');
		// fetch
		getApi(`drink/?drink=${command}`)
			.then(returnedDrink => {
				if (returnedDrink.length > 0) {
					const drink = returnedDrink[0];
					getPrimaryColor(drink.drink_thumb)
						.then(color => {
							const drinkEmbed = new Discord.MessageEmbed()
								.setColor(color)
								.addField('Glass:', drink.glass)
								.setTitle('Drink Name: ' + drink.drink)
								.setDescription(drink.instructions)
								.setImage(drink.drink_thumb);
							for (let i = 0; i < drink.ingredients.length; i++) {
								drinkEmbed.addField(drink.ingredients[i] + ':', (drink.measurement[i] === '' || drink.measurement[i] === undefined ? 'Not specified' : drink.measurement[i]));
							}
							msg.reply(drinkEmbed);
						});
				} else {
					msg.reply('Sorry, we don\'t have instructions for that one!');
				}
			});
	} else if (msg.content.startsWith(ingredientPrefix) && !msg.author.bot) {
		const command = msg.content.replace(ingredientPrefix, '').replace(' ', '%20');
		getApi(`ingredient/?ingredient=${command}`)
			.then(returnedDrinks => {
				if (returnedDrinks.length > 0) {
					let addedDrinks = 0;
					let messageReply = 'Here\'s the list of drinks with the provided ingredient(s)!\n';
					for (let i = 0;
						(i < returnedDrinks.length) && (messageReply.length < discordMsgLmt); i++) {
						messageReply += returnedDrinks[i].drink + '\n';
						addedDrinks += 1;
					}
					if (returnedDrinks.length > addedDrinks) {
						messageReply += '\n... Too many to list them all! Discord limits my message size :( \n';
					}
					messageReply += '\nRequest ingredients and instructions by typing ' + drinkPrefix + ' followed by the desired drink name!';
					msg.reply(messageReply);
				} else {
					msg.reply('I don\'t have any drinks with that ingredient :(');
				}
			});
	} else if (msg.content.startsWith(categoryPrefix) && !msg.author.bot) {
		const args = msg.content.slice(categoryPrefix.length).trim().split(' ');
		const command = args.shift().toLowerCase();
		msg.reply(getDrinksByCategory(command));
	}
};

const getDrinksByCategory = function (category) {
	// fetch('ourapilink/category/name')
	//     .then(response => response.json())
	//     .then(data =>  {
	//         return data;
	//     });
	// const resultDrinks = listOfDrinks;
	// var messageReply = "Here's the list of drinks with the provided category!\n"
	// for(var i = 0; i < resultDrinks.drinks.length; i++){
	//     messageReply += resultDrinks.drinks[i].drink + '\n';
	// }
	// messageReply += '\nRequest ingredients and instructions by typing !kyle followed by the desired drink name!';
	// return messageReply;
	return 'Feature is not yet implemented.';
};

const getPrimaryColor = async function (image) {
	const primaryColor = await getColors(image)
		.then(colors => {
			return colors[0].name();
		});
	return primaryColor;
};

module.exports = {
	kyleNoWorking,
	getKyleCommand
};