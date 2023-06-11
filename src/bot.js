require('dotenv').config();

const discord = require('discord.js')
const axios = require('axios');
const tokenPricePrefix = '$';

const loginToken = process.env.BOT_TOKEN;

// console.log(loginToken);

// Import the bot
const { Client, IntentsBitField} = discord;

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
client.on('messageCreate', async(message) => {
    // console.log(message.content)
    
    
    if (!message.content.startsWith(tokenPricePrefix) || message.author.bot) {
        return;
    }

    const args = message.content.slice(tokenPricePrefix.length).trim().split(' ');
    const command = args.shift().toLocaleLowerCase();

    if (command === 'token_price') {
        const token = args[0];

        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`);
            const price = response.data[token].usd;

            message.channel.send(`The current price of ${token} is $${price}`);
        } catch (error) {
            message.channel.send('Token not found');
        }
    }

    if (message.content === 'hello') {
        message.reply("Hey!");
    }

    if (!message.content.startsWith(tokenPricePrefix) || message.author.bot) {
        return;
    }
});

client.login(loginToken);


