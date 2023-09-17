const Ephemeral = require("../Utils/Ephemeral");
const setImage = require("../Utils/setImage");
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "bye_test",
    usage: ['bye_test'],
    description: "Teste votre annonce de départ.",
    permission: 'ManageChannels',
    permissions: PermissionFlagsBits.ManageChannels,
    category: 'Admin',
    on: false,
    dm: false,
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(async servers => {
            if (servers.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let server = servers[0];
            let bye = server.bye;

            if (bye.message == null && bye.img == null) return message.reply(Ephemeral("Veuillez au moins définir un message et/ou une image de départ pour votre serveur ! (`/bye`)"));
            bye.message = bye.message.replace(/memberping/g, sender);
            bye.message = bye.message.replace(/membercount/g, message.guild.memberCount);
            bye.message = bye.message.replace(/membername/g, sender.username);
            bye.message = bye.message.replace(/guildname/g, message.guild.name);
            bye.message = bye.message.replace(/membertag/g, sender.username+"#"+sender.discriminator);

            if (bye.img !== null) {
                setImage(bye.img, sender.displayAvatarURL({ extension: 'png', size: 1024 }), sender, message.guild, 1).then(img => {
                    message.reply({ content: bye.message, files: [img] });
                });
            } else message.reply(bye.message);
        });
    }
}
