const { EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const loadFiche = require('../Utils/loadFiche');
const Ephemeral = require('../Utils/Ephemeral');
const FindDB = require('../Utils/FindDB');
const UpdateDB = require('../Utils/UpdateDB');

module.exports = {
    name: "reacrole",
    usage: ['reacrole'],
    description: "Ajoute un rôle à un groupe de rôles à réaction.",
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
            autocomplete: true
        },
        {
            type: "role",
            name: "role",
            description: "Mention du rôle.",
            required: true,
            autocomplete: false
        }
    ],
    async autocomplete(bot, db, interaction) {},
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply("Ce serveur n'a pas encore été approuvé par le propriétaire du bot !");
            let guild = guilds[0];
            let group = args.get('groupe').value;
            let role = args.get('role').role;
            let groupes = guild.reacroles;
            let dt = {};

            if (!groupes.find(g => g.name === group)) return message.reply(Ephemeral(`Ce groupe n'existe pas ! (\`grouproles\` pour le créer)`));
            if (!role) return message.reply({ content: "Je ne trouve pas le rôle indiqué...", ephemeral: true });
            let index = groupes.indexOf(groupes.find(g => g.name === group));
            grp = groupes.find(g => g.name === group);
            if (grp.roles.find(r => r.id === role.id)) return message.reply(Ephemeral(`Ce rôle est déjà présent dans ce groupe de rôles à réaction.`));
            let highest = message.guild.members.cache.get(bot.user.id).roles.highest.position;
            let autorole = message.guild.roles.cache.get(role);
            if (role.position > highest) return message.reply(Ephemeral(`Ce rôle est trop haut pour moi.`));
            grp.roles.push({role: role.id, emoji: "" });
            groupes[index] = grp;

            UpdateDB(bot.db, "servers", { guild: guild.guild }, { $set: { reacroles: groupes }});

            return message.reply(`Le rôle **${role.name}** vient d'être ajouté dans le groupe **${group}** de rôles à réaction`);
        });
    }
}
