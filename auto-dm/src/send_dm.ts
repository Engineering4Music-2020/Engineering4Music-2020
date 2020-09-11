import { Autohook } from "twitter-autohook";
import dotenv from "dotenv";

dotenv.config();

async function start() {
    try {
        const webhook = new Autohook();

        await webhook.removeWebhooks();

        await webhook.start();

        await webhook.subscribe({
            oauth_token: process.env.TWITTER_ACCESS_TOKEN, 
            oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
}

start();