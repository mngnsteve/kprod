const { EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const loadFiche = require('../Utils/loadFiche');
const Ephemeral = require('../Utils/Ephemeral');
const FindDB = require('../Utils/FindDB');
const UpdateDB = require('../Utils/UpdateDB');

module.exports = {
    name: "grouproles",
    usage: ['grouproles'],
    description: "Crée un groupe de rôles à réaction.",
    permission: PermissionFlagsBits.ManageRoles,
    category: 'Admin',
    on: true,
    dm: true,
    options : [
        {
            type: "string",
            name: "groupe",
            description: "Nom du groupe de rôles dans lequel on ajoute le rôle à réaction. (Créé si inexistant)",
            required: true,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply("Ce serveur n'a pas encore été approuvé par le propriétaire du bot !");
            let guild = guilds[0];
            let group = args.get('groupe').value;
            let groupes = guild.reacroles;
            if (groupes.find(g => g.name === group)) return message.reply(Ephemeral(`Ce groupe existe déjà !`));
            groupes.push({ name: group, roles: [], msg: "" });

            UpdateDB(bot.db, "servers", { guild: guild.guild }, { $set: { reacroles: groupes }});

            return message.reply(`Le groupe **${group}** de rôles à réactions vient d'être créé.`);
        });
    }
}
