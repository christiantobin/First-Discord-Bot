const fetch = require('node-fetch');

const dotenv = require('dotenv').config();

const Discord = require("discord.js");
const { callbackify } = require('util');
const client = new Discord.Client();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on("ready", function() {
	console.log("READY FOR ACTION!");
    client.user.setActivity('!!help.', {type: 'LISTENING'});
});

client.on('message', msg => {
    if (msg.content.toString() == '!!help'){
        msg.reply("\n**Commands:**\n!!rayne\n!!roulette\nOr type a question followed by \'??\'")
    }
})

client.on('message', msg => {
    if (msg.content.length == 69)
        msg.reply("That message was a nice length ;)");
});

client.on('message', msg => {
    if (msg.content.includes('??') && !msg.author.bot)
    {
        const s = getRandomInt(7);
        switch(s){
            case 3:
                msg.reply('Sure.');
                break;
            case 2:
                msg.reply('No.');
                break;
            case 1:
                msg.reply('Perhaps.');
                break;
            default:
                msg.reply('Yes.');
                break;
        };
    }
});

client.on('message', async msg => {
    if (msg.content.toString() == '!!rayne')
    {
        const res = await fetch('https://www.mentalfloss.com/api/facts?page=2&limit=1&cb=0.3276683361034485').then(response => response.json());
        const message = "**Random fact:** " + res[0].fact; 
        msg.channel.send(message);
    }
})

client.on('message', async msg => {
    if (msg.content.toString() == '!!roulette')
    {
        switch (getRandomInt(5)){
            case 0:
                msg.reply('💥🔫 Sorry you lost.');
                break;
            default:
                msg.reply('💦🔫 Whew. You\'re safe.');
                break;
        }
    }
})
