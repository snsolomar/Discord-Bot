require('dotenv').config();

const discord = require('discord.js')
const axios = require('axios');
const { OpenAI } = require('openai');


const tokenPrice = '$';

// Ask Cassandra
const askCassandra = "Cassandra";

// Configure Discord API
const loginToken = process.env.BOT_TOKEN;

// Configure OpenAI API
const openaiApiKey = process.env.OPEN_AI_TOKEN;
const openaiApiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

// Reference these docs for how to use openAI
// https://www.codingthesmartway.com/how-to-use-openai-api-with-axios/

// Instantiate the OpenAI client
async function getGpt3Response(prompt) {
    const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
            prompt: prompt,
            max_tokens: 60,
        },
        {
            headers: {
                'Authorization': "Bearer" + `${openaiApiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data.choices[0].text.trim();
}




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

    if (content.startsWith(askCassandra)) {
        // Removes "Cassandra" from the message
        const prompt = content.slice(askCassandra.length).trim(); 
        try {
            const gptResponse = await getGpt3Response(prompt);
            message.channel.send(gptResponse);
        } catch (error) {
            console.error(error);
            message.channel.send('Sorry, I was unable to generate a response.');
        }
    } 
    
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

        conversationLog.push({
            role: 'user',
            content: message.content,
        });

        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: conversationLog,
        })

        message.reply(result.data.choices[0].message.content);

    } else if (message.content === 'hello') {
        message.reply("Hey!");
    }
});


client.login(loginToken);


