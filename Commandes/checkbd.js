const { EmbedBuilder } = require('discord.js');
const FindDB = require('../Utils/FindDB');
const moment = require('moment');
const Ephemeral = require('../Utils/Ephemeral');
moment.locale('fr');

module.exports = {
    name: "checkbd",
    usage: ['checkbd [@user]'],
    description: "Affiche l'anniversaire d'un utilisateur.",
    permission: 'Aucune',
    category: 'Utile',
    on: true,
    dm: true,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Mention de l'utilisateur dont l'on souhaite afficher l'anniversaire.",
            required: false,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let guild = guilds[0];
            let user = args.get('membre');

            if (!user) {
                user = sender;
            } else user = user.user;

            FindDB(bot.db, "users", { user: user.id }).then(async users => {
                if (users.length < 1) return message.reply(Ephemeral(`Cet utilisateur n'a aucune date d'anniversaire enregistrée !`));
                let member = users[0];
                let from = moment(moment(), "DD/MM/YYYY");
                let date = member.bd+"/"+from.format('YYYY');
                let nbs = date.split("/");
                if ((parseInt(nbs[0]) < from.day() && parseInt(nbs[1]) === from.month()) || parseInt(nbs[1]) < from.month()) {
                    nbs[2] = parseInt(nbs[2])+1;
                    date = nbs.join("/");
                }
                let to = moment(date, "DD/MM/YYYY");

                let embed = new EmbedBuilder();
                embed.setAuthor({ name: 'Birthdate !' });
                embed.setColor(bot.color);
                embed.setDescription(`Date d'anniversaire: ${member.bd}\nProchain anniversaire **${from.to(to)}**`);
                embed.setFooter({ text: `Anniversaire de ${user.tag}`});

                await message.reply({ embeds: [embed] });
            });
        });
    }
}
