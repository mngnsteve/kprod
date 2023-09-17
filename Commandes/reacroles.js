const { EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const loadFiche = require('../Utils/loadFiche');
const Ephemeral = require('../Utils/Ephemeral');
const FindDB = require('../Utils/FindDB');
const UpdateDB = require('../Utils/UpdateDB');

module.exports = {
    name: "reacroles",
    usage: ['reacroles'],
    description: "Crée le message d'un groupe de rôles à réaction.",
    permission: PermissionFlagsBits.ManageRoles,
    category: 'Admin',
    on: true,
    dm: true,
    options : [
        {
            type: "string",
            name: "groupe",
            description: "Nom du groupe de rôles dans lequel on ajoute le rôle à réaction. (Créé si inexistant)",
            required: true,
            autocomplete: true
        },
        {
            type: "channel",
            name: "channel",
            description: "Salon du groupe de rôles à réaction.",
            required: true,
            autocomplete: true
        },
        {
            type: "string",
            name: "msgid",
            description: "ID du message du groupe de rôles à réaction.",
            required: false,
            autocomplete: false
        }
    ],
    async autocomplete(bot, db, interaction) {},
    async run(bot, db, message, sender, args) {
        bot.db.db('kika').collection('servers').find({ guild: message.guild.id }).toArray().then(guilds => {
            if (guilds.length < 1) return message.reply("Ce serveur n'a pas encore été approuvé par le propriétaire du bot !");
            let guild = guilds[0];
            let group = args.get('groupe').value;
            let channel = args.get('channel').channel;
            let msgid = args.get('msgid') ? args.get('msgid').value : null;
            let groupes = guild.reacroles;
            let s = "";
            s += "Réagissez aux réactions correspondants aux rôles suivants pour le recevoir:\n";

            if (!groupes.find(g => g.name === group)) return message.reply(Ephemeral(`Ce groupe n'existe pas ! (\`grouproles\` pour le créer)`));
            if (!channel) return message.reply({ content: "Je ne trouve pas le salon indiqué...", ephemeral: true });
            let index = groupes.indexOf(groupes.find(g => g.name === group));
            grp = groupes.find(g => g.name === group);
            let roles = grp.roles;
            let i = 0;

            message.reply(`Message du groupe **${group}** de rôles à réactions créé.`);

            if (msgid == null) {
                channel.send(s).then(msg => {
                    if (grp.msg !== "") {
                        groupes.push(grp);
                    }
                    grp.msg = msg.id;
                    message.channel.send(`[${i+1}/${roles.length}] Réagissez à ce message avec la réaction que vous souhaitez attribuer au rôle **${message.guild.roles.cache.get(roles[i].role).name}**.`).then(m => {
                        let filter = (reaction, user) => user.id === sender.id;
                        let collect = m.createReactionCollector({ filter: filter, time: 300000 });
                        collect.on('collect', r => {
                            let emoji = bot.getEmoteString(r.emoji.name, r.emoji.id);
                            s += `\n${r.emoji} : ${message.guild.roles.cache.get(roles[i].role).name}`;
                            msg.edit(s);
                            msg.react(emoji);
                            roles[i].emoji = emoji;
                            if (i == roles.length-1) {
                                collect.stop();
                            } else {
                                i++;
                                m.edit(`[${i+1}/${roles.length}] Réagissez à ce message avec la réaction que vous souhaitez attribuer au rôle **${message.guild.roles.cache.get(roles[i].role).name}**.`);
                            }
                        });

                        collect.on('end', collected => {
                            if (i !== roles.length-1) {
                                m.edit(`Vous avez mis trop de temps à mettre les réactions...`);
                            } else {

                                UpdateDB(bot.db, "servers", { guild: guild.guild }, { $set: { reacroles: groupes }});
                                return m.edit(`Toutes les réactions ont été définies avec succès !`);
                            }
                        });
                    });
                });
            } else {
                channel.messages.fetch(msgid).then(msg => {
                    if (grp.msg !== "") {
                        groupes.push(grp);
                    }
                    grp.msg = msg.id;

                    message.channel.send(`[${i+1}/${roles.length}] Réagissez à ce message avec la réaction que vous souhaitez attribuer au rôle **${message.guild.roles.cache.get(roles[i].role).name}**.`).then(m => {
                        let filter = (reaction, user) => user.id === sender.id;
                        let collect = m.createReactionCollector({ filter: filter, time: 300000 });
                        collect.on('collect', r => {
                            let emoji = bot.getEmoteString(r.emoji.name, r.emoji.id);
                            if (roles.find(r => r.emoji === emoji)) return message.channel.send(`L'émoji proposé est déjà attribué à un rôle !`);
                            s += `\n${r.emoji} : ${message.guild.roles.cache.get(roles[i].role).name}`;
                            if (msg.author.id === bot.user.id) msg.edit(s);
                            msg.react(emoji);
                            roles[i].emoji = emoji;
                            if (i == roles.length-1) {
                                collect.stop();
                            } else {
                                i++;
                                m.edit(`[${i+1}/${roles.length}] Réagissez à ce message avec la réaction que vous souhaitez attribuer au rôle **${message.guild.roles.cache.get(roles[i].role).name}**.`);
                            }
                        });

                        collect.on('end', collected => {
                            if (i !== roles.length-1) {
                                m.edit(`Vous avez mis trop de temps à mettre les réactions...`);
                            } else {

                                UpdateDB(bot.db, "servers", { guild: guild.guild }, { $set: { reacroles: groupes }});
                                return m.edit(`Toutes les réactions ont été définies avec succès !`);
                            }
                        });
                    });
                });
            }

            // UpdateDB(bot.db, "servers", { guild: guild.guild }, { $set: { reacroles: groupes }});

            // return message.reply(`Le rôle **${role.name}** vient d'être ajouté dans le groupe **${group}** de rôles à réaction`);
        });
    }
}
