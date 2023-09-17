const { } = require('discord.js');
const setImage = require('../Utils/setImage');

module.exports.run = async (bot, guild, member) => {
    if (guild.welcome.enabled) {
        if (guild.autoroles.length > 0) {
            guild.autoroles.forEach(r => {
                let role = member.guild.roles.cache.find(ro => ro.id === r);
                member.roles.add(role);
            });
        }
        if (guild.welcome.channel !== null) {
            let ch = member.guild.channels.cache.get(guild.welcome.channel);
            let string = ""+(guild.welcome.message !== null ? guild.welcome.message : "");
            string = string.replace(/memberping/g, member);
            string = string.replace(/membercount/g, member.guild.memberCount);
            string = string.replace(/membername/g, member.user.username);
            string = string.replace(/guildname/g, member.guild.name);
            string = string.replace(/membertag/g, member.user.username+"#"+member.user.discriminator);

            if (guild.welcome.img !== null) {
                setImage(guild.welcome.img, member.user.displayAvatarURL({ extension: "png", size: 1024 }), member.user, member.guild, 0).then(async img => {
                    ch.send({ content: string, files: [img] });
                }).catch((e) => {
                    ch.send({ content: "Il y a eu un soucis à l'envoi de l'image de bienvenue, vérifiez que le lien de l'image définie soit toujours bien valide !\n\n```Arrivée de "+member.user.username+"#"+member.user.discriminator+"```" });
                });
            } else ch.send({ content: string });
        }
    }
}
