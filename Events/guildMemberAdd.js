const { } = require('discord.js');

module.exports = async (bot, member) => {
    const verification = require("../Blocs/verif");
    const welcome = require('../Blocs/welcome');

    bot.db.db('kika').collection('servers').find({ guild: member.guild.id }).toArray().then(guilds => {
        if (guilds.length < 1) return;
        let guild = guilds[0];

        if (guild.verif.channel) {
            if (member.user.bot) {
                welcome.run(bot, guild, member);
            } else verification.run(bot, guild, member);
        } else if (guild.welcome.channel) {
            welcome.run(bot, guild, member);
        } else return;
    });
}