require('dotenv').config();

const discord = require('discord.js')
const axios = require('axios');
const mongoose = require('mongoose');
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

    if (message.author.bot) {
        return;
    }

    const content = message.content;

    if (content.startsWith(tokenPrice)) {
        const args = content.slice(tokenPrice.length).trim().split(' ');
        const command = args.shift().toLocaleLowerCase();

        if (command === 'price') {
            const token = args[0];

            try {
                const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`);
                const price = response.data[token].usd;
                message.channel.send(`The current price of ${token} is $${price}`);
            } catch (error) {
                message.channel.send('Token not found');
            }
        }
    } else if (content.startsWith("Cassandra ")) {
        
        let conversationLog = [{ role: 'system', content: "You are a friendly chatbot."}];

        // Remove "Cassandra " from the start of the content string before sending to the GPT model
        const gptContent = content.replace("Cassandra ", "");

        conversationLog.push({
            role: 'user',
            content: gptContent,
        });

        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: conversationLog,
        })

        message.reply(result.data.choices[0].message.content);

    } else if (message.content.toLowerCase() === 'hello' || message.content.toLowerCase() === 'hi') {
        message.reply("Hey!");
    }
});



client.login(loginToken);

