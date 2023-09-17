const { } = require('discord.js');
const setImage = require('../Utils/setImage');

module.exports.run = async (bot, guild, member) => {
    if (guild.bye.enabled) {
        if (guild.bye.channel !== null) {
            let ch = member.guild.channels.cache.get(guild.bye.channel);
            let string = ""+(guild.bye.message !== null ? guild.bye.message : "");
            string = string.replace(/memberping/g, member);
            string = string.replace(/membercount/g, member.guild.memberCount);
            string = string.replace(/membername/g, member.user.username);
            string = string.replace(/guildname/g, member.guild.name);
            string = string.replace(/membertag/g, member.user.username+"#"+member.user.discriminator);

            if (guild.bye.img !== null) {
                setImage(guild.bye.img, member.user.displayAvatarURL({ extension: "png", size: 1024 }), member.user, member.guild, 1).then(async (img) => {
                    ch.send({ content: string, files: [img] });
                }).catch((e) => {
                    ch.send({ content: "Il y a eu un soucis à l'envoi de l'image de départ, vérifiez que le lien de l'image définie soit toujours bien valide !\n\n```Départ de "+member.user.username+"#"+member.user.discriminator+"```" });
                });
            } else ch.send({ content: string });
        }
    }
};
