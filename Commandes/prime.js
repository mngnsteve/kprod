const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const isImage = require("../Utils/isImage");

module.exports = {
    name: "prime",
    usage: ["prime <perso> <prime> <details>\n+ <joindre une image à la commande>"],
    description: "Ajoute une nouvelle prime au RP.",
    category: "Admin",
    on: true,
    permissions: PermissionFlagsBits.ManageMessages,
    options: [
        {
            type: "string",
            name: "perso",
            description: "Indiquez le nom et/ou le prénom du personnage ou encore son surnom.",
            required: true,
            autocomplete: false
        },
        {
            type: "number",
            name: "montant",
            description: "Indiquez le montant de la prime.",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "details",
            description: "Indiquez quelques détails utiles sur le personnage (crimes, localisation, etc...)",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "image",
            description: "Indiquez le lien de l'image du personnage.",
            required: true,
            autocomplete: false
        }
    ],
    dm: true,
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let guild = guilds[0];
            let perso = args.get('perso').value;
            let montant = args.get('montant').value;
            let details = args.get('details').value;
            let image = args.get('image').value;

            if (!perso) return message.reply(`Veuillez indiquer un prénom (ou un surnom !)`);
            if (!montant) return message.reply(`Veuillez indiquer le montant de la prime !`);
            if (!details) return message.reply(`Veuillez fournir quelques informations sur le personnage ! (crimes, localisations, etc...)`);
            if (!image) return message.reply(`Veuillez joindre le lien de l'image du personnage !`);
            if (!isImage(image)) return message.reply(`L'image est invalide ! (PNG/JPG/JPEG seulement)`);

            let embed = new EmbedBuilder();
            embed.setAuthor({ name: perso });
            embed.setDescription(`__**\`¤ PRIME :\`**__ ${montant} PO\n\n__**\`¤ Détails :\`**__\n${details}`);
            embed.setColor(bot.color);
            embed.setImage(image);
            embed.setFooter({ text:"Desbrigants" });
            embed.setTimestamp(new Date());
            let channel = message.guild.channels.cache.find(ch => ch.id === "658446382486650910");

            channel.send({ embeds: [embed] });
            return message.reply(`La prime vient d'être publiée avec succès !`);
        });
    }
}
