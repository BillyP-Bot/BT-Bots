import { Message } from "discord.js";
import fetch from "node-fetch";

import * as dianne from "./dianne";

// let kanyeVideoIDs = [];

export const goodFriday = (msg: Message, googleAPIKey: string): void => {
	if (msg.content == "!tobyFriday" && !msg.author.bot) {
		fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=80&playlistId=PLdYwhvDpx0FLEfzLe3BVZip4V4kAF1g1H&key=" + googleAPIKey)
			.then(response => response.json())
			.then(data => {
				let randomInt = dianne.getRandomIntInclusive(0, data.items.length);
				let yeezus = data.items[randomInt].snippet.resourceId.videoId;

				msg.channel.send("G.O.O.D. FRIDAYS, I HOPE YOU HAVE A NICE WEEKEND! \n\nhttps://www.youtube.com/watch?v=" + yeezus);
			});
	}
};

export const goodFridayBot = (client: any, googleAPIKey: string): void => {
	let generalChannel = "689463685571149933";
	fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=80&playlistId=PLdYwhvDpx0FLEfzLe3BVZip4V4kAF1g1H&key=" + googleAPIKey)
		.then(response => response.json())
		.then(data => {
			let randomInt = dianne.getRandomIntInclusive(0, data.items.length);
			let yeezus = data.items[randomInt].snippet.resourceId.videoId;

			client.channels.cache.get(generalChannel).send("G.O.O.D. FRIDAYS, I HOPE YOU HAVE A NICE WEEKEND! \n\nhttps://www.youtube.com/watch?v=" + yeezus);
		});
};
