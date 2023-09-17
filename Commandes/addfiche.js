const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const loadFiche = require('../Utils/loadFiche');
const isImage = require('../Utils/isImage');
const Ephemeral = require('../Utils/Ephemeral');
const FindDB = require('../Utils/FindDB');

module.exports = {
    name: "addfiche",
    usage: ['addfiches'],
    description: "Ajoute une fiche RP dans la base de données.",
    permissions: 'Aucune',
    category: 'RP',
    on: true,
    dm: false,
    options : [
        {
            type: "string",
            name: "nom",
            description: "Nom du personnage",
            required: true,
            autocomplete: true
        },
        {
            type: "string",
            name: "prenom",
            description: "Prénom du personnage",
            required: true,
            autocomplete: true
        },
        {
            type: "number",
            name: "age",
            description: "Age du personnage",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "race",
            description: "Race du personnage",
            required: true,
            autocomplete: true
        },
        {
            type: "string",
            name: "sexe",
            description: "Sexe du personnage",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "affiliation",
            description: "Affiliation du personnage",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "image",
            description: "Lien de l'image du personnage.",
            required: false,
            autocomplete: false
        },
        {
            type: "string",
            name: "surnom",
            description: "Surnom du personnage",
            required: false,
            autocomplete: false
        }
    ],
    async autocomplete(bot, db, interaction) {
        const entry = interaction.options.getFocused(true);
        let choices;

        if (entry.name === 'nom' || entry.name === 'prenom' || entry.name === 'affiliation') {
            choices = ['Aucun'];
        }

        if (entry.name === "race") {
            choices = [
                'Humain',
                'Zuma',
                'Hylrulien',
                'Kherudo',
                'Koroki',
                'Rito',
                'Khen-Ta',
                'Oni',
                'Toorg',
                'Aora',
                'Fulgur',
                'Humain-Hylrulien',
                'Humain-Koroki',
                'Humain-Kherudo',
                'Humain-Oni',
                'Hylrulien-Humain',
                'Hylrulien-Koroki',
                'Hylrulien-Kherudo',
                'Hylrulien-Oni',
                'Kherudo-Hylrulien',
                'Kherudo-Koroki',
                'Kherudo-Oni',
                'Zuma-Koroki',
                'Zuma-Aora',
                'Koroki-Humain',
                'Koroki-Zuma',
                'Koroki-Hylrulien',
                'Koroki-Oni',
                'Koroki-Kherudo',
                'Koroki-Aora',
                'Oni-Humain',
                'Oni-Kherudo',
                'Oni-Koroki',
                'Aora-Koroki',
                'Aora-Zuma'
            ];
        }

        while (entry) {
            const filtered = choices.filter(choice => choice.startsWith(entry.value));
            try {
                await interaction.respond(
                    filtered.splice(0, 25).map(choice => ({ name: choice, value: choice })),
                );
            } catch (e) {
                interaction.responded = false;
            }

        }
    },
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply({ content: `Ce serveur n'a pas encore été approvué par le propriétaire du bot !`, ephemeral: true });
            let guild = guilds[0];
            let nom = args.get('nom').value !== "Aucun" ? args.get('nom').value : '';
            let prenom = args.get('prenom').value !== "Aucun" ? args.get('prenom').value : '';
            let age = args.get('age').value;
            let race = args.get('race').value;
            let sexe = args.get('sexe').value;
            let affi = args.get('affiliation').value;
            let img = args.get('image') ? args.get('image').value : null;
            let surnom = args.get('surnom') ? args.get('surnom').value : '';
            if (!isImage(img)) return message.reply(Ephemeral(`Le lien entré de l'image n'est pas valide !`));
            let dt = {
                owner: sender.id,
                nom: nom,
                prenom: prenom,
                surnom: surnom,
                age: age,
                race: race,
                sexe: sexe,
                affi: affi,
                image: img
            }

            FindDB(db.db, 'fiches', { owner: sender.id, nom: nom, prenom: prenom, surnom: surnom }).toArray().then(async persos => {
                if (persos.length > 0) return message.reply(Ephemeral(`La fiche de ce personnage existe djéà !`));
                db.db('kika').collection('fiches').insertOne({ owner: sender.id, nom: nom, prenom: prenom, surnom: surnom, age: age, race: race, sexe: sexe, affiliation: affi, image: img });
                await message.reply({ content: `La fiche a été ajoutée avec succès !`, embeds: [await loadFiche(bot, dt)] });
            });
        });
    }
}
