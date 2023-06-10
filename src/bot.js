require('dotenv').config();

// Import the bot
const { Client, IntentsBitField} = require('discord.js');

// Intents are a set of permissions you bots can use to get access to a set of events
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,

    ]
})


