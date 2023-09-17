const { REST, Routes, SlashCommandBuilder } = require('discord.js');

module.exports = async bot => {

    let commands = [];

    bot.commands.forEach(async cmd => {
        
        let slashcmd = new SlashCommandBuilder()
        .setName(cmd.name)
        .setDescription(cmd.description)
        .setDMPermission(cmd.dm)
        .setDefaultMemberPermissions(cmd.permissions === "Aucune" ? null : cmd.permissions)

        if (cmd.options?.length >= 1) {
            for (let i = 0; i < cmd.options.length; i++) {
                if (cmd.options[i].type === "string") {
                    slashcmd[`add${cmd.options[i].type.slice(0, 1).toUpperCase() + cmd.options[i].type.slice(1, cmd.options[i].type.length)}Option`](option => 
                        option
                        .setName(cmd.options[i].name)
                        .setDescription(cmd.options[i].description)
                        .setAutocomplete(cmd.options[i].autocomplete)
                        .setRequired(cmd.options[i].required));
                } else slashcmd[`add${cmd.options[i].type.slice(0, 1).toUpperCase() + cmd.options[i].type.slice(1, cmd.options[i].type.length)}Option`](option => 
                    option
                    .setName(cmd.options[i].name)
                    .setDescription(cmd.options[i].description)
                    .setRequired(cmd.options[i].required));
            }
        }

        await commands.push(slashcmd);
    });

    const rest = new REST({ version: "10" }).setToken(bot.token);

    await rest.put(Routes.applicationCommands(bot.user.id), { body: commands });
    console.log("[SLSHCMD] Chargement des commandes Slash ...");
}