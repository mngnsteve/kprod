const Ephemeral = require("../Utils/Ephemeral");
const UpdateDB = require("../Utils/UpdateDB");
const { PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: "ticket_set",
    usage: ['ticket_set <nom> <channel> <category>'],
    description: "Paramètre un créateur de tickets.",
    permission: 'ManageChannels',
    permissions: PermissionFlagsBits.ManageChannels,
    category: 'Admin',
    on: true,
    dm: false,
    options : [
        {
            type: "string",
            name: "nom",
            description: "Nom du créateur de tickets (1 seul mot exigé)",
            required: true,
            autocomplete: false
        },
        {
            type: "channel",
            name: "channel",
            description: "Salon où pourra s'effectuer l'ouverture d'un ticket.",
            required: true,
            autocomplete: false
        },
        {
            type: "channel",
            name: "category",
            description: "Catégorie où seront créés les tickets.",
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
            let channel = args.get('channel').channel;
            let category = args.get('category').channel;
            if (nom.split(" ").length > 1) return message.reply(Ephemeral(`Le nom ne doit faire qu'un mot !`));
            if (tickets.find(t => t.name === nom)) return message.reply(Ephemeral(`Un créateur de ticket de ce nom existe déjà...`));
            if (!channel.type === 0) return message.reply(Ephemeral(`Veuillez indiquer un salon textuel en premier paramètre !`));
            if (!category.type === 4) return message.reply(Ephemeral(`Veuillez indiquer une catégorie en second paramètre !`));

            let embed = new EmbedBuilder();
            const row = new ActionRowBuilder();
            embed.setAuthor({ name: `Ticket "${nom}"` });
            embed.setDescription(`Réagissez à la réaction ci-dessous pour ouvrir le ticket qui vous permettra de poster votre fiche:`);
            embed.setColor(bot.color);
            let ticketid = bot.generateID();
            let button = new ButtonBuilder()
            .setCustomId(`ticket-${ticketid}`)
            .setLabel("Ouverture d'un ticket")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("📨");

            row.addComponents(button);

            channel.send({ embeds: [embed], components: [row] }).then(m => {
                let dt = {};

                dt.id = ticketid;
                dt.interaction = `ticket-${ticketid}`;
                dt.channel = channel.id;
                dt.name = nom;
                dt.category = category.id;
                dt.emoji = bot.getEmoteString("📨", null);
                dt.msg = m.id;
                dt.tickets = [];
                dt.access = [];
                dt.count = 0;
                tickets.push(dt);

                UpdateDB(bot.db, "servers", { guild: server.guild }, { $set: { tickets: tickets }});
                return message.reply(`Le message de ticket a été posté avec succès !`);
            });
        });
    }
}
