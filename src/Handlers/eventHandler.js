const path = require('path');
const getAllFiles = require('../utils/getAllFiles')

// you're dynamically importing and calling event files based on their names matching with Discord event names. This structure relies on having folders with event names (like messageCreate, guildMemberAdd, etc.), and inside those folders, there are JavaScript files that export a function to be executed when the respective event fires.
module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);
  
    for (const eventFolder of eventFolders) {
      const eventFiles = getAllFiles(eventFolder);
      eventFiles.sort((a, b) => a > b);
      // console.log(eventFiles);
  
      const eventName = path.basename(eventFolder);
  
      client.on(eventName, async (arg) => {
        for (const eventFile of eventFiles) {
          const eventFunction = require(eventFile);
          await eventFunction(client, arg);
        }
      });
    }
  };