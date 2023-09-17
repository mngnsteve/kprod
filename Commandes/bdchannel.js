const Ephemeral = require("../Utils/Ephemeral");
const UpdateDB = require("../Utils/UpdateDB");
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "bdchannel",
    usage: ['bdchannel <channel> [activation]'],
    description: "Paramètre le salon d'annonce des anniversaires.",
    permission: 'ManageChannels',
    permissions: PermissionFlagsBits.ManageChannels,
    category: 'Admin',
    on: false,
    dm: false,
    options : [
        {
            type: "channel",
            name: "salon",
            description: "Salon d'annonce des anniversaires.",
            required: true,
            autocomplete: false
        },
        {
            type: "boolean",
            name: "activation",
            description: "Activation ou non des annonces d'anniversaire.",
            required: false,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(async servers => {
            if (servers.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let server = servers[0];

            let channel = args.get('salon').channel;
            let bool = args.get('activation') ? args.get('activation').value : null;
            let string = "";

            if (!channel) return message.reply(Ephemeral("Veuillez indiquer un salon valide !"));

            let config = {};
            config.enabled = server.bd.enabled ? server.bd.enabled : null;
            config.channel = server.bd.channel ? server.bd.channel : null;

            config.channel = channel.id;
            string += `:white_check_mark: Salon d'annonce des anniversaires: ${channel}\n`;
            if (bool !== null) {
                config.enabled = bool;
                string += `:white_check_mark: Activation des annonces des anniversaires.`;
            }

            UpdateDB(bot.db, "servers", { guild: server.guild }, { $set: { bd: config } });

            message.reply(string).then(msg => {
                channel.send(`**Ce salon a été désigné pour recevoir les annonces d'anniversaires !**\nVous pouvez enregistrer votre anniversaire avec la commande \`/setbd\`\nVous pouvez accéder à votre date d'anniversaire ou celle d'un autre avec la commande \`/checkbd\`\n\n*Note: les anniversaires du jour sont toujours annoncés à minuit, heure française. Si jamais il n'est pas annoncé le jour J, cela ne peut alors être qu'en raison d'une inactivité de ma part au moment venu !*`).then(m => {
                    try {
                        m.pin();
                    } catch(e) {};
                });
            });
        });
    }
}
