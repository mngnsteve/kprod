const { InteractionType, EmbedBuilder, ButtonBuilder, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonStyle } = require('discord.js');
const FindDB = require('../Utils/FindDB');
const UpdateDB = require('../Utils/UpdateDB');
const Ephemeral = require('../Utils/Ephemeral');

module.exports = async (bot, interaction) => {
    /**
     * Récupère un emote de choco
     * @param {string} name
     * @returns Retourne l'emote
     */
    try {
        let getEmote = (name) => {
            let emote = bot.emojis.cache.find(e => e.name === name);
            return emote;
        }

        let sender = interaction.user;

        if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            const command = interaction.client.commands.get(interaction.commandName);

            try {
                await command.autocomplete(bot, bot.db, interaction);
            } catch (err) {
                console.error(err);
            }
        }

        bot.getEmote = getEmote;

        if (interaction.isButton()) {
            const row = new ActionRowBuilder();
            FindDB(bot.db, 'servers', { guild: interaction.guild.id }).then(guilds => {
                if (guilds.length < 1) return;
                let guild = guilds[0];
                if (interaction.customId.startsWith('ticket')) {
                    let ticket = guild.tickets.find(t => t.interaction === interaction.customId);
                    if (ticket) {
                        interaction.guild.channels.create({
                            name: `${ticket.name}-${ticket.count}`,
                            type: ChannelType.GuildText,
                            parent: ticket.category,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                                }
                            ]
                        }).then(ch => {
                            ticket.access.forEach(ro => {
                                let r = interaction.guild.roles.cache.find(rol => rol.id === ro);
                                if (!r) return;
                                ch.permissionOverwrites.create(r, { ViewChannel: true, SendMessages: true });
                            });
                            interaction.reply(Ephemeral(`${ch}`));
                            let embed = new EmbedBuilder();
                            embed.setAuthor({ name: `Ticket N°${ticket.count}` });
                            embed.setColor(bot.color);
                            embed.setDescription(`Bienvenue dans ce ticket !\nAvant toute chose,\n- Pense à te montrer poli, un bonjour ne fera pas de mal !\n- Reste courtois tout au long du jugement, même en cas de désaccord !\n- Ne ping pas le staff, sauf cas de trop longue attente !`);
                            let buttonid = `close-${ticket.id}`;
                            let button = new ButtonBuilder()
                            .setCustomId(buttonid)
                            .setLabel(`Fermer le ticket`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('❎');
                            row.addComponents(button);

                            ch.send({ content: `${interaction.user}`, embeds: [embed], components: [row] }).then(m => {
                                m.pin();
                                ticket.count++;
                                ticket.tickets.push({ channel: ch.id, msg: m.id, close: buttonid });
                                UpdateDB(bot.db, "servers", { guild: guild.guild }, { $set: { tickets: guild.tickets }});
                            });
                        });
                    }
                } else if (interaction.customId.startsWith("close")) {
                    let tickets = guild.tickets.find(t => t.id === interaction.customId.substring(6, interaction.customId.length));
                    let ticket = tickets.tickets.find(t => t.close === interaction.customId);
                    if (ticket) {
                        interaction.reply(`Le ticket va être fermé d'ici quelques secondes...`).then(m => {
                            setTimeout(() => {
                                try {
                                    interaction.channel.delete();
                                } catch (e) {}
                            }, 5000);
                        });
                    }
                }
            });
        }

        if (interaction.type === InteractionType.ApplicationCommand) {
            const cmd = bot.commands.get(interaction.commandName);
            if (!cmd.on) {
                if (sender.id !== "338655019685380098") return;
            }
            cmd.run(bot, bot.db, interaction, sender, interaction.options);
        }
	} catch(e) { console.error(e) };
}
