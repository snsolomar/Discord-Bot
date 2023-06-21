const path = require('path');
const getAllFiles = require('./getAllFiles');

//includes specific commands based on your choice
module.exports = (exceptions) => {
    let localCommands = [];

    const commandCategories = getAllFiles(
        path.join(__dirname, '..', 'commands'),
        true
    )

    for (const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory);

        for (const commandFile of commandFiles) {
            const commandObject = require(commandFile);
            localCommands.push(commandObject);
        }
    }
    
    return localCommands;
}