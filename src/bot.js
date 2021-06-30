const dotenv = require('dotenv').config();

const Discord = require("discord.js");
const client = new Discord.Client();

client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on("ready", function() {
	console.log("READY FOR ACTION!");
});

client.on('message', msg => {
    if (msg.content.length == 69)
        msg.reply("That message was a nice length ;)");
});

