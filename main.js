const { Client, IntentsBitField, Partials, Collection } = require('discord.js');
const intents = new IntentsBitField(3276799);
const bot = new Client({intents, partials: [ Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User ] });
const loadCmds = require('./Loaders/loaderCmds');
const loadEvts = require('./Loaders/loaderEvts');
const config = require('./config');

bot.commands = new Collection();
bot.aliases = new Collection();
bot.color = "B2B89A";
bot.prefix = config.prefix;
bot.getEmoteString = (name, id) => {
    let emote;
    if (id === null) {
        emote = name;
    } else {
        emote = name+":"+id;
    }
    return emote;
};
bot.generateID = () => {
    let s = "";
    for (let i = 0; i < 10; i++) {
        s+= Math.floor((Math.random()*9)+1);
    }
    return s;
};

loadCmds(bot);
loadEvts(bot);

bot.login(config.token);