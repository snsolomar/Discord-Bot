require('dotenv').config();

const loginToken = process.env.BOT_TOKEN;

// console.log(loginToken);

// Import the bot
const { Client, IntentsBitField} = require('discord.js');

// Intents are a set of permissions you bots can use to get access to a set of events
// List of Itents can be found in the following url: https://discord.com/developers/docs/topics/gateway#gateway-intents
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.login(loginToken)


