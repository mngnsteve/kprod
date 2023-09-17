const {} = require('discord.js');
const loadDb = require('../Loaders/loaderDb');
const loadSlashCmds = require('../Loaders/loaderSlashCmds');
const FindDB = require('../Utils/FindDB');
const moment = require('moment');
moment.locale('fr');

module.exports = async bot => {
    bot.db = await loadDb();
    bot.db.connect(err => {
        if (err) throw err;
        console.log("[DB] Chargement de la DB ...");
    });
    
    setInterval(() => {
        let today = moment().format("DD/MM/YY HH:mm:ss");
        bot.guilds.cache.forEach(g => {
            FindDB(bot.db, "servers", { guild: g.id }).then(guilds => {
                if (guilds.length < 1) return;
                let guild = guilds[0];
                if (!guild.bd) return;
                let s = "";
                FindDB(bot.db, "users", {}).then(users => {
                    let i = 0;
                    users.forEach(u => {
                        if (g.members.cache.get(u.user)) {
                            let bd = u.bd+"/"+moment().format("YY")+" 00:00:00";
                            if (today === bd) {
                                i++;
                                s += `- ${g.members.cache.get(u.user)}\n`
                            };
                        }
                    });

                    if (i > 0) {
                        if (guild.bd.enabled == true) {
                            g.channels.cache.get(guild.bd.channel).send(`:partying_face::cake: Le **${moment().format("DD/MM")}**, nous fêtons l'anniversaire de:\n\n${s}`);
                        }
                    }
                });
            });
        });
    }, 1000);

    await loadSlashCmds(bot);
    console.log(`${bot.user.tag} est maintenant en ligne !`);
    bot.user.setActivity({ name: "Kikashizen", type: 3 });
};
