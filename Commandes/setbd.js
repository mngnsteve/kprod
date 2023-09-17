const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
moment.locale('fr');
const Ephemeral = require('../Utils/Ephemeral');
const FindDB = require('../Utils/FindDB');
const UpdateDB = require('../Utils/UpdateDB');

module.exports = {
    name: "setbd",
    usage: ['setbd <jour> <mois>'],
    description: "Affiche l'avatar d'un utilisateur.",
    permission: 'Aucune',
    category: 'Utile',
    on: true,
    dm: true,
    options: [
        {
            type: "number",
            name: "jour",
            description: "Jour de votre anniversaire.",
            required: true,
            autocomplete: false
        },
        {
            type: "number",
            name: "mois",
            description: "mois de votre anniversaire.",
            required: true,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(async guilds => {
            if (guilds.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let guild = guilds[0];
            let jour = args.get('jour').value;
            let mois = args.get('mois').value;

            if (jour < 1 || jour > 31) return message.reply(Ephemeral(`Vous devez selectionner un jour entre le 1 et 31 !`));
            if (mois < 1 || mois > 12) return message.reply(Ephemeral(`Vous devez selectionner un mois entre le 1 et le 12`));
            jour = jour.toString().length < 2 ? "0"+jour : jour.toString();
            mois = mois.toString().length < 2 ? "0"+mois : mois.toString();
            let date = jour+"/"+mois;
            let impossible = ["30/02", "31/02", "31/04", "31/06", "30/09", "30/11"];
            if (impossible.includes(date)) return message.reply(Ephemeral(`Cette date n'existe pas.`));
            FindDB(bot.db, 'users', { user: sender.id }).then(users => {
                if (users.length < 1) {
                    bot.db.db('kika').collection('users').insertOne({ user: sender.id, bd: date });
                } else {
                    let user = users[0]
                    UpdateDB(bot.db, 'users', { user: sender.id }, { $set: { bd: date } });
                }
            })


            let embed = new EmbedBuilder();
            embed.setAuthor({ name: 'Setted Birthday !'});
            embed.setColor(bot.color);

            let from = moment(moment(), "DD/MM/YYYY");
            let date2 = date+"/"+from.format('YYYY');
            let nbs = date2.split("/");
            if ((parseInt(nbs[0]) < from.day() && parseInt(nbs[1]) === from.month()) || parseInt(nbs[1]) < from.month()) {
                nbs[2] = parseInt(nbs[2])+1;
                date2 = nbs.join("/");
            }
            let to = moment(date2, "DD/MM/YYYY");
            embed.setDescription(`Anniversaire défini: ${date} *(${from.to(to)})*`);
            embed.setFooter({ text: `Anniversaire de ${sender.tag}` });

            await message.reply({ embeds: [embed] });
        });
    }
}
