const { EmbedBuilder } = require('discord.js');

module.exports = async (bot, dt) => {
    const embed = new EmbedBuilder();
    embed.setColor(bot.color);
    embed.setThumbnail(bot.users.cache.get(dt.owner).displayAvatarURL());
    embed.addFields([
        {
            name: 'Prénom',
            value: `${dt.prenom.length > 0 ? dt.prenom : '...'}`,
            inline: true
        },
        {
            name: 'Nom',
            value: `${dt.nom.length > 0 ? dt.nom : '...'}`,
            inline: true
        },
        {
            name: 'Surnom',
            value: `${dt.surnom.length > 0 ? dt.surnom : '...'}`,
            inline: false
        },
        {
            name: 'Âge',
            value: `${dt.age}`,
            inline: true
        },
        {
            name: 'Race',
            value: `${dt.race}`,
            inline: true
        },
        {
            name: 'Affiliation',
            value: `${dt.affi.length > 0 ? dt.affi : '...'}`,
            inline: true
        }
    ]);
    embed.setImage(dt.image);
    embed.setFooter({ text: `De ${bot.users.cache.get(dt.owner).tag}`});
    embed.setTimestamp();

    return embed;
}