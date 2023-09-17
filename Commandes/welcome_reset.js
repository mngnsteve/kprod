const Ephemeral = require("../Utils/Ephemeral");
const UpdateDB = require("../Utils/UpdateDB");
const setImage = require("../Utils/setImage");
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "welcome_reset",
    usage: ['welcome_reset [message] [image]'],
    description: "Réintialise les paramètres du message de bienvenue.",
    permission: 'ManageChannels',
    permissions: PermissionFlagsBits.ManageChannels,
    category: 'Admin',
    on: false,
    dm: false,
    options : [
        {
            type: "boolean",
            name: "message",
            description: "Réintialiser ou non le message de bienvenue.",
            required: false,
            autocomplete: false
        },
        {
            type: "boolean",
            name: "image",
            description: "Réintialiser ou non l'image de bienvenue.",
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

            if (!msg & !image) return message.reply(Ephemeral("Vous n'avez rien à supprimer !"));

            let string = "";
            string += "**Réintialisation des paramètres du message de bienvenue:**\n";
            let config = {};
            config.enabled = server.welcome.enabled ? server.welcome.enabled : false;
            config.channel = server.welcome.channel ? server.welcome.channel : null;
            config.message = server.welcome.message ? server.welcome.message : null;
            config.img = server.welcome.img ? server.welcome.img : null;

            config.message = msg ? null : config.message;
            string += `${msg ? "¤ Réintilisation du message de bienvenue...\n" : ""}`;
            config.img = image ? null : config.img;
            string += `${image ? "¤ Réintilisation de l'image de bienvenue...\n" : ""}`;

            if (message && image) config.enabled = false;
            string += `${message && image ? "\n**Il n'y a ni message, ni image de défini.\nPar conséquent, l'annonce de bienvenue est désactivée !**" : ""}`;

            UpdateDB(bot.db, "servers", { guild: server.guild }, { $set: { welcome: config } });

            message.reply(string);
        });
    }
}
