const { EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "autorole",
    usage: ['autorole'],
    description: "Défini un rôle automatique.",
    permissions: PermissionFlagsBits.ManageRoles,
    category: 'Admin',
    on: true,
    dm: false,
    options : [
        {
            type: "string",
            name: "role",
            description: "Mention du rôle.",
            required: true,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply("Ce serveur n'a pas encore été approuvé par le propriétaire du bot !");
            let guild = guilds[0];

            let role = args.get('role').value.slice(3, args.get('role').value.length-1);
            if (!message.guild.roles.cache.get(role)) return message.reply({ content: "Ce rôle n'existe pas !", ephemeral: true });
            let highest = message.guild.members.cache.get(bot.user.id).roles.highest.position;
            let autorole = message.guild.roles.cache.get(role);
            if (autorole.position > highest) return message.reply({ content: "Ce rôle est trop haut pour moi.", ephemeral: true });

            guild.autoroles.push(autorole.id);
            bot.db.db('kika').collection('servers').updateOne({ guild: message.guild.id }, { $set: { autoroles: guild.autoroles } });
            return message.reply({ content: `Le rôle \`${autorole.name}\` a été défini comme autorole !`, ephemeral: true });
        });
    }
}
