const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "avatar",
    usage: ['avatar [@user]'],
    description: "Affiche l'avatar d'un utilisateur.",
    permissions: 'Aucune',
    category: 'Utile',
    on: true,
    dm: true,
    options: [
        {
            type: "string",
            name: "membre",
            description: "Mention de l'utilisateur dont l'on souhaite afficher l'avatar.",
            required: false,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let guild = guilds[0];
            let user = args.get('membre') ? args.get('membre').value.slice(2, args.get('membre').value.length-1) : null;
            if (!user) {
                user = sender;
            } else user = message.guild.members.cache.get(user);

            let embed = new EmbedBuilder();
            embed.setAuthor({ name: 'Avatar !'});
            embed.setColor(bot.color);
            embed.setImage(user.displayAvatarURL({ size: 2048, dynamic: true }));
            embed.setFooter({ text: `Avatar de ${user.tag}` });

            return message.reply({ embeds: [embed] });
        });
    }
}
