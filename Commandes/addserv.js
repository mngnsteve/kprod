const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    name: "addserv",
    usage: ['addserv'],
    description: "Ajoute un serveur dans la configuration du bot.",
    permissions: 'Aucune',
    category: 'Owner',
    on: false,
    dm: true,
    options : [
        {
            type: "string",
            name: "id",
            description: "ID du serveur.",
            required: true,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        if (sender.id !== "338655019685380098") return message.reply('Seul le propriétaire du bot est autorisé à faire usage de cette commande !');
        let id = args.get('id').value;
        if (!bot.guilds.cache.get(id)) return message.reply('Je ne suis pas présent sur le serveur voulu...');
        let paque = {};
        paque.on = false;
        bot.db.db('kika').collection('servers').insertOne({ guild: id, welcome: {}, bye: {}, verif: {}, autoroles: [], paque: paque });
        return message.reply(`Le serveur **${bot.guilds.cache.get(id).name}** a été enregistré avec succès !`);
    }
}
