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

// .on is a method that has access to a list of events, works like an event handler
client.on('ready', (c) => {
    console.log(`${c.user.tag} is online!`);
});

// This event listener can only work the the intent is provided in the client
client.on('messageCreate', (message) => {
    // console.log(message.content)
    if (message.author.bot) {
        return;
    }

    if (message.content === 'hello') {
        message.reply("Hey!");
    }
});

client.login(loginToken);


