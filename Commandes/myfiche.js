const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const loadFiche = require('../Utils/loadFiche');

module.exports = {
    name: "myfiche",
    usage: ['myfiche'],
    description: "Affiche une de vos fiches.",
    permissions: 'Aucune',
    category: 'RP',
    on: true,
    dm: false,
    options : [
        {
            type: "number",
            name: "numero",
            description: "Numéro du personnage",
            required: false,
            autocomplete: true
        }
    ],
    async autocomplete(bot, db, interaction) {
        let NomOumar = "Lusansulusiawamutombompolondomukambangontchobimiondochikwang";
        const entry = interaction.options.getFocused(true);
        let choices = [];

        let kikadb = await db.db('kika').collection('fiches');
        kikadb.find({ owner: interaction.user.id }).toArray().then(async persos => {
            persos.forEach(p => {
                if (p.nom.length < 1 || p.prenom.length < 1) {
                    choices.push(p.surnom);
                } else if (p.nom.length < 1) {
                    choices.push(p.prenom);
                } else if (p.prenom.length < 1) {
                    choices.push(p.nom == NomOumar ? '': p.nom);
                } else {
                    choices.push(p.prenom+" "+(p.nom == NomOumar ? '': p.nom));
                }
                i++;
            });

            while (entry) {
                const filtered = choices.filter(choice => choice.startsWith(entry.value));
                try {
                    let i = 0;
                    await interaction.respond(
                        filtered.splice(0, 25).map(choice => {
                            let ch = { name: (i+1)+" - "+choice, value: i+1 };
                            i++;
                            return (ch);
                        }),
                    );
                } catch (e) {
                    interaction.responded = false;
                }
            }
        });
    },
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let guild = guilds[0];
            let nb = args.get('numero') ? args.get('numero').value : null;
            let dt = {};

            if (nb == null) {
                db.db('kika').collection('fiches').find({ owner: sender.id }).toArray().then(async persos => {
                    let list = [];
                    let NomOumar = "Lusansulusiawamutombompolondomukambangontchobimiondochikwang";
                    let i = 0;
                    persos.forEach(p => {
                        if (p.nom.length < 1 || p.prenom.length < 1) {
                            list.push(`[${i+1}] - ${p.surnom}`);
                        } else if (p.nom.length < 1) {
                            list.push(`[${i+1}] - ${p.prenom}`);
                        } else if (p.prenom.length < 1) {
                            list.push(`[${i+1}] - ${p.nom == NomOumar ? '': p.nom}`);
                        } else {
                            list.push(`[${i+1}] - ${p.prenom} ${(p.nom == NomOumar ? '': p.nom)}`);
                        }
                        i++;
                    });

                    await message.reply(`__**Tous vos personnages:**__\n\n${list.map(p => `${p}`).join('\n')}`);
                });
            } else {
                db.db('kika').collection('fiches').find({ owner: sender.id }).toArray().then(async persos => {

                    if (nb < 1 || nb > persos.length) return message.reply("Le numéro indiqué est invalide !");

                    let perso = persos[nb-1];

                    dt.owner = perso.owner;
                    dt.nom = perso.nom;
                    dt.prenom = perso.prenom;
                    dt.surnom = perso.surnom;
                    dt.age = perso.age;
                    dt.race = perso.race;
                    dt.sexe = perso.sexe;
                    dt.affi = perso.affiliation;
                    dt.image = perso.image;

                    await message.reply({ embeds: [await loadFiche(bot, dt)] });
                });
            }
        });
    }
}
