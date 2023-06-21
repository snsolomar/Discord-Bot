module.exports = {
    name: 'ban',
    description: "bans a member from the server",
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: 

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`)
    }
}