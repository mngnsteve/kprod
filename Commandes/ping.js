const { } = require('discord.js');

module.exports = {
    name: 'ping',
    usage: ['ping'],
    description: 'Donne la latence du bot !',
    category: 'Utile',
    on: true,
    permissions: 'Aucune',
    dm: true,
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(async guilds => {
            if (guilds.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let guild = guilds[0];
            await message.reply(`Mon ping: ${bot.ws.ping}`);
        });
    }
}
