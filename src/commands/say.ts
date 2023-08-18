import {
	ApplicationCommandOptionChoiceData,
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from "discord.js";

import {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	VoiceConnectionStatus
} from "@discordjs/voice";
import { CommandNames, VoiceURLs } from "@enums";
import { Api, getInteractionOptionValue } from "@helpers";
import { ISlashCommand } from "@types";

export const sayCommand: ISlashCommand = {
	name: CommandNames.say,
	description: "Make BillyP say something",
	options: [
		{
			name: "prompt",
			description: "What do you want BillyP to say?",
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	handler: async (int: ChatInputCommandInteraction) => {
		await int.deferReply();
		const member = int.guild.members.cache.get(int.member.user.id);
		const voiceChannel = member?.voice?.channel;
		if (!voiceChannel) throw "You must be in a voice channel to use this command!";
		const prompt = getInteractionOptionValue<string>("prompt", int);
		if (!prompt) throw "You must provide a prompt!";
		const mp3Url = await getMp3Url(prompt, int.guildId);
		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: voiceChannel.guild.id,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator
		});
		const player = createAudioPlayer();
		const resource = createAudioResource(mp3Url);
		player.play(resource);
		connection.subscribe(player);
		player.on(AudioPlayerStatus.Idle, () => {
			setTimeout(() => {
				if (player.state.status === AudioPlayerStatus.Idle) {
					player.stop();
					player.removeAllListeners();
					if (connection.state.status !== VoiceConnectionStatus.Destroyed)
						connection.destroy();
				}
			}, 60000);
		});
		await int.editReply(`*"${prompt}"*`);
	}
};

const getMp3Url = async (prompt: string, server_id: string) => {
	// const data = await Api.post<{ url: string }>(VoiceURLs.outputs, {
	// 	server_id,
	// 	name: prompt,
	// 	text: prompt
	// });
	// return data.url;
	return "https://github.com/cdleveille/puttjs/raw/master/snd/cup.mp3";
};

export const addVoiceOptionToCommandsList = async (commands: ISlashCommand[]) => {
	const data = await Api.get<{ name: string }[]>(VoiceURLs.voices);
	const voiceChoices = data.map(({ name }) => {
		return { name, value: name } as ApplicationCommandOptionChoiceData<string>;
	});
	return commands.map((command) => {
		if (command.name === CommandNames.say) {
			return {
				...command,
				options: [
					...command.options,
					{
						name: "voice",
						description: "The voice to use",
						type: ApplicationCommandOptionType.String,
						required: true,
						choices: voiceChoices
					}
				]
			};
		}
		return command;
	});
};
