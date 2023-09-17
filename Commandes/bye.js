const Ephemeral = require("../Utils/Ephemeral");
const UpdateDB = require("../Utils/UpdateDB");
const setImage = require("../Utils/setImage");
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "bye",
    usage: ['bye [enabled] [channel] [message] [image]'],
    description: "Définis le salon de départ, son message et, possiblement, une image de départ.",
    permission: 'ManageChannels',
    permissions: PermissionFlagsBits.ManageChannels,
    category: 'Admin',
    on: false,
    dm: false,
    options : [
        {
            type: "boolean",
            name: "enabled",
            description: "Activer ou non le message de départ.",
            required: false,
            autocomplete: false
        },
        {
            type: "string",
            name: "channel",
            description: "Indiquer le salon d'annonce de départ.",
            required: false,
            autocomplete: false
        },
        {
            type: "string",
            name: "message",
            description: "Rédiger un message de départ (2000 caractères max).",
            required: false,
            autocomplete: false
        },
        {
            type: "string",
            name: "image",
            description: "Joindre le lien d'une image (JPG/JPEG/PNG) de départ (Taille **1024x500** recommandée).",
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
            string += "**Configuration de l'annonce de départ:**\n"
            let config = {};
            config.enabled = server.bye.enabled ? server.bye.enabled : false;
            config.channel = server.bye.channel ? server.bye.channel : null;
            config.message = server.bye.message ? server.bye.message : null;
            config.img = server.bye.img ? server.bye.img : null;

            if (enabled === null) return message.reply(`**Configuration de l'annonce de départ:**\n¤ Annonce de départ: ${config.enabled === false ? ":negative_squared_cross_mark:" : ":white_check_mark:"}\n¤ Salon de départ: ${config.channel !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n¤ Message de départ: ${config.message !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n¤ Image de départ: ${config.img !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n\n**Notez que le salon est __obligatoire__ et qu'au moins le message ou l'image est obligatoire !**\n\nQuelques tags à mettre dans votre message:\n- \`memberping\` sera remplacé par la mention de l'utilisateur.\n- \`membername\` sera remplacé par le nom d'utilisateur de l'utilisateur.\n- \`membertag\` sera remplacé par le Tag#0000 de l'utilisateur.\n- \`guildname\` sera remplacé par le nom du serveur.\n- \`membercount\` sera remplacé par le nombre de membres sur le serveur.`);

            if (enabled) {
                if (channel == null) {
                    if (msg == null && image == null) {
                        if (config.channel == null) {
                            if (config.message == null && config.img == null) return message.reply(Ephemeral(`Je ne peux activer l'annonce de départ sans ces prérequis:\n¤ Salon de départ: ${(config.channel !== null || channel !== null) ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n¤ Message de bienvenue: ${(config.message !== null || msg !== null)  ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n¤ Image de bienvenue: ${(config.img !== null || image !== null)  ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n\n**Notez que le salon est __obligatoire__ et qu'au moins le message ou l'image est obligatoire !**\n\nQuelques tags à mettre dans votre message:\n- \`memberping\` sera remplacé par la mention de l'utilisateur.\n- \`membername\` sera remplacé par le nom d'utilisateur de l'utilisateur.\n- \`membertag\` sera remplacé par le Tag#0000 de l'utilisateur.\n- \`guildname\` sera remplacé par le nom du serveur.\n- \`membercount\` sera remplacé par le nombre de membres sur le serveur.`));
                        }
                    }
                }
            }

            if (enabled) {
                string += "¤ Annonce de départ: :white_check_mark:\n";
            } else {
                string += "¤ Annonce de départ: :negative_squared_cross_mark:\n";
            }

            if (enabled && channel !== null) {
                if (!message.guild.channels.cache.get(channel)) return message.reply(Ephemeral(`Le salon indiqué n'est pas valide !`));
                config.channel = channel;
                string += "¤ Salon de départ: :white_check_mark:\n";
            } else {
                string += `¤ Salon de départ: ${config.channel !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n`;
            }

            if (enabled && msg !== null) {

                if (msg.length > 2000) return message.reply(Ephemeral(`Le message de départ est beaucoup trop long !`));
                config.message = msg;
                msg = msg.replace(/memberping/g, sender);
                msg = msg.replace(/membercount/g, message.guild.memberCount);
                msg = msg.replace(/membername/g, sender.username);
                msg = msg.replace(/guildname/g, message.guild.name);
                msg = msg.replace(/membertag/g, sender.username+"#"+sender.discriminator);
                string += "¤ Message de départ: :white_check_mark:\n";
            } else {
                string += `¤ Message de départ: ${config.message !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n`;
            }

            if (enabled && image !== null) {
                if (!isImage(image)) return message.reply(Ephemeral(`Le lien de l'image est invalide ! (N'accepte que des images JPG/JPEG/PNG !)`));
                config.img = image;
                string += "¤ Image de départ: :white_check_mark:\n"
            } else {
                string += `¤ Image de départ: ${config.img !== null ? ":white_check_mark:" : ":negative_squared_cross_mark:"}\n`;
            }

            UpdateDB(bot.db, 'servers', { guild: server.guild }, { $set: { bye: config } });

            message.reply(string);
            if (msg == null && image == null) return;
            if (image !== null) {
                setImage(image, sender.displayAvatarURL({ extension: 'png', size: 1024 }), sender, message.guild, 1).then(async (img) => {
                    message.channel.send({ content: msg !== null ? msg : "", files: [img] });
                });
            } else message.channel.send(msg);
        });
    }
}
