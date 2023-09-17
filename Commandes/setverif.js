const { EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "setverif",
    usage: ['setverif channel'],
    description: "Définis le salon de vérification.",
    permissions: PermissionFlagsBits.ManageChannels,
    on: true,
    dm: false,
    options : [
        {
            type: "string",
            name: "channel",
            description: "Salon de vérification.",
            required: true,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(async servers => {
            if (servers.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let server = servers[0];

            let channel = args.get('channel').value.slice(2, args.get('channel').value.length-1);
            if (!bot.guilds.cache.get(server.guild).channels.cache.get(channel)) return message.reply({ content: "Je ne trouve pas le salon indiqué...\nVérifiez bien que j'y ai accès !"});
            server.verif.channel = channel;
            let set = { guild: server.guild };
            let update = { $set: { verif: server.verif } };
            bot.db.db('kika').collection('servers').updateOne(set, update);

            return message.reply({ content: `Le salon de vérification a bien été défini: <#${channel}>` });
        });
    }
}
