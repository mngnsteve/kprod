const { EmbedBuilder, MessageCollector } = require('discord.js');

module.exports.run = (bot, guild, member) => {
    const welcome = require('../Blocs/welcome');
    let embed = new EmbedBuilder();
    let err = 0;
    let questions1 = [
        {
            question: "De quelle couleur sont les cheveux **rouge** de Jin ?",
            answer: "rouge"
        },
        {
            question: "De quelle couleur sont les cheveux **bleu** de Ygg ?",
            answer: "bleu"
        },
        {
            question: "De quelle couleur sont les cheveux **vert** de Albazio ?",
            answer: "vert"
        },
        {
            question: "De quel arbre est tiré le Toorg **Sapin** ?",
            answer: "sapin"
        },
        {
            question: "De quel animal est tiré le Koroki **Lion** ?",
            answer: "lion"
        },
        {
            question: "De quel animal est tiré le Zuma **Requin** ?",
            answer: "requin"
        }
    ];

    let rand = Math.floor(Math.random()*questions1.length);
    let q1 = questions1[rand];

    let channel = member.guild.channels.cache.get(guild.verif.channel);
    embed.setAuthor({ name: "Vérification de "+ member.user.username +" !" });
    embed.setDescription(`*Pour accéder au serveur, vous devez procéder à une vérification que vous n'êtes pas un robot.\nVous n'avez pas droit à plus de 3 erreurs, sinon, vous serez automatiquement expulsé du serveur.\nVous disposez de 10 minutes pour répondre. Passé ce délai, vous serez automatiquement expulsé.\nVous gardez, cependant, toujours la possiblité de revenir pour retenter.*\n\n**Question:**\n${q1.question}`);
    embed.setColor(bot.color);
    embed.setFooter({ text: "Erreur: "+err+"/3"});
    channel.send(`<@${member.id}>`).then(msg => {
        setTimeout(() => {
            msg.delete();
        }, 30*1000);
    });

    channel.send({ embeds: [embed] }).then(msg => {
        let f1 = m => m.author.id === member.id;
        let collect = new MessageCollector(msg.channel, {f1, time: 10*60000 });

        collect.on("collect", m => {
            if (m.author.id !== member.id) return;
            let answer = m.content.toLowerCase();
            if (answer !== q1.answer) {
                m.delete();
                err++;
                embed.setFooter({ text: "Erreur: "+err+"/3" });
                embed.setColor("#FF0000");
                msg.edit({ embeds: [embed] });
                setTimeout(() => {
                    embed.setColor(bot.color);
                    msg.edit({ embeds: [embed] });
                }, 1500);
                if (err > 2) {
                    return collect.stop();
                }
            } else {
                m.delete();
                embed.setColor("77D91E");
                msg.edit({ embeds: [embed] });
                setTimeout(() => {
                    return collect.stop();
                }, 1500);
            }
        });

        collect.on("end", collected => {
            if (err > 2) {
                member.kick("Trop de mauvaises réponses !");
            } else {
                let userhere = member.guild.members.cache.filter((m => m.id === member.id));
                if (userhere.length < 1) {
                    return;
                } else {
                    welcome.run(bot, guild, member);
                    return msg.delete();
                }
            }
        });
    });
}
