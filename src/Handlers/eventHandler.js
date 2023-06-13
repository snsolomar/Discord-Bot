const path = require('path');
const getAllFiles = require('../Utils/getAllFiles');

module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);
  
    for (const eventFolder of eventFolders) {
      const eventFiles = getAllFiles(eventFolder);
      
    //   console.log(eventFiles);

    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
    client.on(eventName, async (arg) => {
        for (const eventFile of eventFiles) {
            const eventFunction = require(eventFile);
            await eventFunction(client, arg)
        }
    })
    }
  };