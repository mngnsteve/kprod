const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "help",
    usage: ["help [cmd]"],
    description: "Affiche l'aide des commandes.",
    category: "Utile",
    on: true,
    permissions: 'Aucune',
    options: [
        {
            type: "string",
            name: "cmd",
            description: "Indiquez la commande dont vous voulez des renseignements.",
            required: false,
            autocomplete: true
        }
    ],
    dm: true,
    async autocomplete(bot, db, interaction) {
        const entry = interaction.options.getFocused();
        const choices = bot.commands.filter(cmd => cmd.name.includes(entry) && cmd.on === true);
        await interaction.respond(
            choices.map(choice => ({ name: choice.name, value: choice.name }))
        );
    },
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let guild = guilds[0];
            let category = [];
            let cmd = args.get('cmd') ? args.get('cmd').value : null;
            let cmds = bot.commands;
            if (!cmd) {
                cmds.forEach(cmd => {
                    if (cmd.on === true) {
                        if (!category.includes(cmd.category)) category.push(cmd.category);
                    }
                });

                let embed = new EmbedBuilder();
                embed.setAuthor({ name: 'Help !'});
                embed.setColor(bot.color);
                category.forEach(cat => {
                    embed.addFields({ name: cat, value: cmds.filter(c => c.category === cat).map(c => `\`${c.name}\``).join("|") });
                });
                embed.setFooter({ text: `Faites "help <cmd>" pour plus d'informations sur une commande !` });

                return message.reply({ embeds: [embed] });
            } else {
                if (!bot.commands.has(cmd)) return message.reply({ content: "Cette commande n'existe pas.", allowedMentions: { repliedUser: false } });
                cmd = bot.commands.get(cmd);
                let embed = new EmbedBuilder();
                embed.setAuthor({ name: 'Help !' });
                embed.setColor(bot.color);
                embed.setDescription("__**"+cmd.name+"**__\n> "+cmd.description+"\n\n```Utilisation(s):\n"+cmd.usage.map(usage => `- ${usage}`).join('\n')+"```");

                return message.reply({ embeds: [embed] });
            }
        });
    }
}
