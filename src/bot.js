require('dotenv').config();
const express = require("express");

const discord = require('discord.js')
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');


const tokenPrice = '$';

// Ask Cassandra
const askCassandra = "Cassandra";

// Configure Discord API
const loginToken = process.env.BOT_TOKEN;

// Configure OpenAI API
const openaiApiKey = process.env.OPEN_AI_TOKEN;

const config = new Configuration({
    apiKey: `${openaiApiKey}`
})

const openai = new OpenAIApi(config);

// Initalize
const app = express();


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
    
    if (message.author.bot) {
        return;
    }

    const content = message.content;

    let conversationLog = [{ role: 'system', content: "You are a friendly chatbot."}];

    conversationLog.push({
        role: 'user',
        content: message.content,
    });

    await content.startsWith("Cassandra ");

    const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    })

    message.reply(result.data.choices[0].message);



    if (content.startsWith(tokenPrice)) {
        const args = content.slice(tokenPrice.length).trim().split(' ');
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
    } else if (message.content === 'hello') {
        message.reply("Hey!");
    }
});

client.login(loginToken);


