const Ephemeral = require("../Utils/Ephemeral");
const UpdateDB = require("../Utils/UpdateDB");
const isImage = require("../Utils/isImage");
const setImage = require("../Utils/setImage");
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "welcome",
    usage: ['welcome [enabled] [channel] [message] [image]'],
    description: "Définis le salon de bienvenue, son message et, possiblement, une image de bienvenue.",
    permission: 'ManageChannels',
    permissions: PermissionFlagsBits.ManageChannels,
    category: 'Admin',
    on: false,
    dm: false,
    options : [
        {
            type: "boolean",
            name: "enabled",
            description: "Activer ou non le message de bienvenue.",
            required: false,
            autocomplete: false
        },
        {
            type: "string",
            name: "channel",
            description: "Indiquer le salon d'annonce de bienvenue.",
            required: false,
            autocomplete: false
        },
        {
            type: "string",
            name: "message",
            description: "Rédiger un message de bienvenue (2000 caractères max).",
            required: false,
            autocomplete: false
        },
        {
            type: "string",
            name: "image",
            description: "Joindre le lien d'une image (JPG/JPEG/PNG) de bienvenue (Taille **1024x500** recommandée).",
            required: false,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(async servers => {
            if (servers.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let server = servers[0];

            let enabled = args.get('enabled') ? args.get('enabled').value : null;
            let channel = args.get('channel') ? args.get('channel').value.slice(2, args.get('channel').value.length-1) : null;
            let msg = args.get('message') ? args.get('message').value : null;
            let image = args.get('image') ? args.get('image').value : null;

            let string = "";
            string += "**Configuration de l'annonce de bienvenue:**\n"
            let config = {};
            config.enabled = server.welcome.enabled ? server.welcome.enabled : false;
            config.channel = server.welcome.channel ? server.welcome.channel : null;
            config.message = server.welcome.message ? server.welcome.message : null;
            config.img = server.welcome.img ? server.welcome.img : null;

            if (enabled === null && channel === null && channel === null && image === null) return message.reply(`**Configuration de l'annonce de bienvenue:**\n¤ Annonce de bienvenue: ${config.enabled === true ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n¤ Salon de bienvenue: ${config.channel !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n¤ Message de bienvenue: ${config.message !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n¤ Image de bienvenue: ${config.img !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n\n**Notez que le salon est __obligatoire__ et qu'au moins le message ou l'image est obligatoire !**\n\nQuelques tags à mettre dans votre message:\n- \`memberping\` sera remplacé par la mention de l'utilisateur.\n- \`membername\` sera remplacé par le nom d'utilisateur de l'utilisateur.\n- \`membertag\` sera remplacé par le Tag#0000 de l'utilisateur.\n- \`guildname\` sera remplacé par le nom du serveur.\n- \`membercount\` sera remplacé par le nombre de membres sur le serveur.`);

            if (enabled) {
                if (channel == null) {
                    if (msg == null && image == null) {
                        if (config.channel == null) {
                            if (config.message == null && config.img == null) return message.reply(Ephemeral(`Je ne peux activer l'annonce de bienvenue sans ces prérequis:\n¤ Salon de bienvenue: ${(config.channel !== null || channel !== null) ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n¤ Message de bienvenue: ${(config.message !== null || msg !== null)  ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n¤ Image de bienvenue: ${(config.img !== null || image !== null)  ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n\n**Notez que le salon est __obligatoire__ et qu'au moins le message ou l'image est obligatoire !**\n\nQuelques tags à mettre dans votre message:\n- \`memberping\` sera remplacé par la mention de l'utilisateur.\n- \`membername\` sera remplacé par le nom d'utilisateur de l'utilisateur.\n- \`membertag\` sera remplacé par le Tag#0000 de l'utilisateur.\n- \`guildname\` sera remplacé par le nom du serveur.\n- \`membercount\` sera remplacé par le nombre de membres sur le serveur.`));
                        }
                    }
                }
            }

            if (enabled !== null) {
                config.enabled = enabled;
                string += "¤ Annonce de bienvenue: :white_check_mark:\n";
            } else {
                string += `¤ Annonce de bienvenue: ${config.enabled === true ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n`;
            }

            if (channel !== null) {
                if (!message.guild.channels.cache.get(channel)) return message.reply(Ephemeral(`Le salon indiqué n'est pas valide !`));
                config.channel = channel;
                string += "¤ Salon de bienvenue: :white_check_mark:\n";
            } else {
                string += `¤ Salon de bienvenue: ${config.channel !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n`;
            }

            if (msg !== null) {

                if (msg.length > 2000) return message.reply(Ephemeral(`Le message de bienvenue est beaucoup trop long !`));
                config.message = msg;
                msg = msg.replace(/memberping/g, sender);
                msg = msg.replace(/membercount/g, message.guild.memberCount);
                msg = msg.replace(/membername/g, sender.username);
                msg = msg.replace(/guildname/g, message.guild.name);
                msg = msg.replace(/membertag/g, sender.username+"#"+sender.discriminator);
                string += "¤ Message de bienvenue: :white_check_mark:\n";
            } else {
                string += `¤ Message de bienvenue: ${config.message !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n`;
            }

            if (image !== null) {
                if (!isImage(image)) return message.reply(Ephemeral(`Le lien de l'image est invalide ! (N'accepte que des images JPG/JPEG/PNG !)`));
                config.img = image;
                string += "¤ Image de bienvenue: :white_check_mark:\n"
            } else {
                string += `¤ Image de bienvenue: ${config.img !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n`;
            }

            UpdateDB(bot.db, 'servers', { guild: server.guild }, { $set: { welcome: config } });

            message.reply(string);
            if (msg == null && image == null) return;
            if (image !== null) {
                setImage(image, sender.displayAvatarURL({ extension: 'png', size: 1024 }), sender, message.guild, 0).then(async (img) => {
                    message.channel.send({ content: msg !== null ? msg : "", files: [img] });
                });
            } else message.channel.send(msg);
        });
    }
}
