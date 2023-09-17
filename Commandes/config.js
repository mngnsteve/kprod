const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "config",
    usage: ['config'],
    description: "Affiche la configuration du bot sur le serveur.",
    permissions: PermissionFlagsBits.ManageGuild,
    category: 'Admin',
    on: true,
    dm: false,
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply({ content: "Ce serveur n'a pas encore été approuvé par le propriétaire du bot !", ephemeral: true });
            let guild = guilds[0];
            const embed = new EmbedBuilder();
            embed.setAuthor({ name: "Configuration du serveur:"});
            embed.setColor(bot.color);
            embed.setFields([
                {
                    name: "Salon de bienvenue",
                    value: `${guild.welcome.channel ? `<#${guild.welcome.channel}>` : "Aucun"}`,
                    inline: true
                },
                {
                    name: "Salon de départ",
                    value: `${guild.bye.channel ? `<#${guild.bye.channel}>` : "Aucun"}`,
                    inline: true
                },
                {
                    name: "Salon de vérification",
                    value: `${guild.verif.channel ? `<#${guild.verif.channel}>` : "Aucun"}`,
                    inline: true
                },
                {
                    name: "Salon des anniversaires",
                    value: `${guild.bd.channel ? `<#${guild.bd.channel}>` : "Aucun"}`,
                    inline: true
                },
                {
                    name: "Autoroles",
                    value: `${guild.autoroles.length > 0 ? guild.autoroles.map(r => `<@&${r}>`) : "Aucun"}`,
                    inline: true
                }
            ]);

            return message.reply({ embeds: [embed] });
        });
    }
}
