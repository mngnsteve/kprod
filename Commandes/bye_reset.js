const Ephemeral = require("../Utils/Ephemeral");
const UpdateDB = require("../Utils/UpdateDB");
const setImage = require("../Utils/setImage");
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "bye_reset",
    usage: ['bye_reset [message] [image]'],
    description: "Réintialise les paramètres du message de départ.",
    permission: 'ManageChannels',
    permissions: PermissionFlagsBits.ManageChannels,
    category: 'Admin',
    on: false,
    dm: false,
    options : [
        {
            type: "boolean",
            name: "message",
            description: "Réintialiser ou non le message de départ.",
            required: false,
            autocomplete: false
        },
        {
            type: "boolean",
            name: "image",
            description: "Réintialiser ou non l'image de départ.",
            required: false,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(async servers => {
            if (servers.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let server = servers[0];

            let msg = args.get('message') ? args.get('message').value : false;
            let image = args.get('image') ? args.get('image').value : false;

            if (!msg & !image) return message.reply(Ephemeral("Vous n'avez rien à réintialiser !"));

            let string = "";
            string += "**Réintialisation des paramètres du message de départ:**\n";
            let config = {};
            config.enabled = server.bye.enabled ? server.bye.enabled : false;
            config.channel = server.bye.channel ? server.bye.channel : null;
            config.message = server.bye.message ? server.bye.message : null;
            config.img = server.bye.img ? server.bye.img : null;

            config.message = null;
            string += `${msg ? "¤ Réintilisation du message de départ...\n" : ""}`;
            config.img = null;
            string += `${image ? "¤ Réintilisation de l'image de départ...\n" : ""}`;

            if (message && image) config.enabled = false;
            string += `${message && image ? "\n**Il n'y a ni message, ni image de défini.\nPar conséquent, l'annonce de départ est désactivée !**" : ""}`;

            UpdateDB(bot.db, "servers", { guild: server.guild }, { $set: { bye: config } });

            message.reply(string);
        });
    }
}
