const { } = require('discord.js');

module.exports = async (bot, member) => {
    const bye = require('../Blocs/bye');
    bot.db.db('kika').collection('servers').find({ guild: member.guild.id }).toArray().then(guilds => {
        if (guilds.length < 1) return;
        let guild = guilds[0];
        return bye.run(bot, guild, member);
    });
}
