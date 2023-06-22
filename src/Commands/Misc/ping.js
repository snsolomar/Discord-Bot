module.exports = {
  name: 'ping',
  description: 'Your current latency:',
  // devOnly: Boolean,
  testOnly: true,
  // options: Object[],
  // deleted: Boolean,

  callback: (client, interaction) => {
    console.log('Ping command was triggered!');
    interaction.reply(`Your current latency: ${client.ws.ping}ms`);
  },
};