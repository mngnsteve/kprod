const Ephemeral = require("../Utils/Ephemeral");
const UpdateDB = require("../Utils/UpdateDB");
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "ticket_access",
    usage: ['ticket_access <nom> <role>'],
    description: "Ajoute un rôle par défaut à un créateur de tickets.",
    permission: 'ManageRoles',
    permissions: PermissionFlagsBits.ManageRoles,
    category: 'Admin',
    on: true,
    dm: false,
    options : [
        {
            type: "string",
            name: "nom",
            description: "Nom du créateur de tickets",
            required: true,
            autocomplete: false
        },
        {
            type: "role",
            name: "role",
            description: "Rôle auquel on donne accès aux tickets.",
            required: true,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(async servers => {
            if (servers.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let server = servers[0];
            let tickets = server.tickets;
            let nom = args.get('nom').value;
            let role = args.get('role').role;
            if (nom.split(" ").length > 1) return message.reply(Ephemeral(`Le nom ne doit faire qu'un mot !`));
            if (!tickets.find(t => t.name === nom)) return message.reply(Ephemeral(`Ce créateur de tickets n'existe pas !`));
            let ticket = tickets.find(t => t.name === nom);
            if (ticket.access.includes(role.id)) return message.reply(Ephemeral(`Ce rôle compte déjà parmi les rôles autorisées à accéder tous les tickets "**${ticket.name}**"`));
            ticket.access.push(role.id);
            ticket.tickets.forEach(t => {
                let ch = message.guild.channels.cache.find(ch => ch.id === t.channel);
                if (!ch) return;
                ch.permissionOverwrites.create(role, { ViewChannel: true, SendMessages: true });
            })
            UpdateDB(bot.db, 'servers', { guild: server.guild }, { $set: { tickets: tickets }});
            await message.reply(`Tous les détenteurs du rôles **${role.name}** pourront désormais accéder à tous les tickets "**${ticket.name}**"`);
        });
    }
}
