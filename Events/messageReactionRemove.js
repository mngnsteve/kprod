const {} = require('discord.js');
const FindDB = require('../Utils/FindDB');

module.exports = async (bot, reac, user) => {
    if (user.bot) return;
    let emoji = bot.getEmoteString(reac.emoji.name, reac.emoji.id);
    FindDB(bot.db, "servers", {guild: reac.message.guild.id }).then(guilds => {
        if (guilds.length < 1) return;
        let guild = guilds[0];
        if (guild.reacroles.find(r => r.msg === reac.message.id)) {
            let reacrole = guild.reacroles.find(r => r.msg === reac.message.id);
            if (reacrole.roles.find(r => r.emoji === emoji)) {
                let role = reac.message.guild.roles.cache.get(reacrole.roles.find(r => r.emoji === emoji).role);
                reac.message.guild.members.fetch().then(m => {
                    m.find(m => m.id === user.id).roles.remove(role.id);
                });
            }
        }
    });
};