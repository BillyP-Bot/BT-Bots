import "dotenv/config";
import path from "path";

export const config = {
	SERVER_ID: "689463685566955566",
	IS_COMPILED: path.extname(__filename).includes("js"),
	IS_PROD: (process.env.NODE_ENV == "production" ? true : false),
	BOT_TOKEN: process.env.BOT_TOKEN || undefined,
	GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || undefined,
	GOOGLE_CX_KEY: process.env.GOOGLE_CX_KEY || undefined,
	YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || undefined,

	BILLY_BACKEND: process.env.BILLY_BACKEND,
	BILLY_BACKEND_TOKEN: process.env.BILLY_BACKEND_TOKEN,
};

if (config.BOT_TOKEN === undefined)
	throw Error("BOT_TOKEN not specified");
else if (config.GOOGLE_API_KEY === undefined)
	throw Error("GOOGLE_API_KEY not specified");
else if (config.GOOGLE_CX_KEY === undefined)
	throw Error("GOOGLE_CX_KEY not specified");
