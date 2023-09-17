const { } = require('discord.js');

module.exports = {
    name: "roll",
    usage: ["roll <faces> [dés]"],
    description: "Commande de roulée de dé(s).",
    category: "Fun",
    on: true,
    permissions: 'Aucune',
    dm: true,
    options: [
        {
            type: "number",
            name: "faces",
            description: "Indiquez le nombre de faces du dé à lancer.",
            required: true,
            autocomplete: false
        },
        {
            type: "number",
            name: "dés",
            description: "Indiquez le nombre de dés à lancer.",
            required: false,
            autocomplete: false
        }
    ],
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let guild = guilds[0];
            let res = [];
            let faces = args.get('faces').value;
            if (faces < 1) return message.reply(`Le nombre de faces se doit d'être une valeur supérieure à 0.`);
            let dés = !args.get('dés') ? 1 : args.get('dés').value;
            if (dés < 1) return message.reply(`Le nombre de dés se doit d'être une valeur supérieure à 0.`);


            do {
                let rand = Math.floor((Math.random() * faces)+1);
                res.push(rand);
            } while (res.length < dés);

            let sum = 0;
            res.forEach(n => sum = sum + n);

            return message.reply(`__**\`¤ Roll:\`**__ ${dés}d${faces}\n__**\`¤ Résultat${dés > 1 ? `s`:``}:\`**__ ${res.join(" | ")}${dés > 1 ? `\n__**\`¤ Somme:\`**__ ${sum}`:``}`).catch((e) => console.error(e));
        });
    }
}
