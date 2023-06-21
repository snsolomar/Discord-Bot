const { testServer } = require("../../../config.json");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands")

module.exports = async (client) => {
    const localCommands = getLocalCommands();

    try {
        const localCommands = getLocalCommands();
        const applicationCommands = getApplicationCommands(client, testServer);

        // loop through local commands and see if there are any differences from your application commands
        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`Deleted command "${name}".`);
                    break;
                }
            }
        }
    } catch (error) {
        console.log(`There was an error ${error}`)
    }
};