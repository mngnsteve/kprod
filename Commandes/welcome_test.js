const Ephemeral = require("../Utils/Ephemeral");
const setImage = require("../Utils/setImage");
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "welcome_test",
    usage: ['welcome_test'],
    description: "Teste votre annonce de bienvenue.",
    permission: 'ManageChannels',
    permissions: PermissionFlagsBits.ManageChannels,
    category: 'Admin',
    on: false,
    dm: false,
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(async servers => {
            if (servers.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let server = servers[0];
            let welcome = server.welcome;

            if (welcome.message == null && welcome.img == null) return message.reply(Ephemeral("Veuillez au moins définir un message et/ou une image de bienvenue pour votre serveur ! (`/welcome`)"));
            welcome.message = welcome.message.replace(/memberping/g, sender);
            welcome.message = welcome.message.replace(/membercount/g, message.guild.memberCount);
            welcome.message = welcome.message.replace(/membername/g, sender.username);
            welcome.message = welcome.message.replace(/guildname/g, message.guild.name);
            welcome.message = welcome.message.replace(/membertag/g, sender.username+"#"+sender.discriminator);

            if (welcome.img !== null) {
                setImage(welcome.img, sender.displayAvatarURL({ extension: 'png', size: 1024 }), sender, message.guild, 0).then(img => {
                    message.reply({ content: welcome.message, files: [img] });
                });
            } else message.reply(welcome.message);
        });
    }
}
