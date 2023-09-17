const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Selectionne un item aléatoire dans un tableau donné
 * @param {Array} list Tableau où sont les items
 * @returns Retourne un item du tableau
 */
let reward = (list) => {
    let reward = list[Math.floor((Math.random()*list.length))];
    return reward;
};
/**
 * Génère un identifiant
 * @returns {string} Retourne l'identifiant
 */
let generate_id = () => {
    let s = "";
    for (let i = 0; i < 10; i++) {
        s+= Math.floor((Math.random()*9)+1);
    }

    return s;
};

module.exports = (bot, message) => {
    if (message.author.bot) return;
    let reacts = ['❤️', '🔁'];
    let mods = ['318205688021123082', '338655019685380098', '219104244664369152', '350311749984976906', '442436875509170177', '370479076961419264', '350324629036072960', '432051840599719966', '442006475037081601'];

    if (mods.includes(message.author.id)) {

        if (message.content === "<@675806371202990080>") {
            if (message.guild.id !== "658436160854687761") return;
            message.delete();
            return message.channel.send("Les discussions se font dans <#658444510304534538> !");
        }
    }

    if (message.channel.id === "940299141278486619") {
        reacts.forEach(r => message.react(r));
    }
};
