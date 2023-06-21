module.exports = {
    name: 'ping',
    description: "pong",
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: 

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`)
    }
}