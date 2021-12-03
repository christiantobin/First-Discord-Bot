import { Client } from "discord.js";

const fetch = require("node-fetch");
const dotenv = require("dotenv").config();
const eco = require("discord-economy");

const discord = new Client();

function getRandomInt(max: any) {
    return Math.floor(Math.random() * max);
}

discord.login(process.env.DISCORDJS_BOT_TOKEN);

discord.on("ready", function () {
    console.log("READY FOR ACTION!");
    discord.user!.setActivity("!!help.", { type: "LISTENING" });
});

discord.on("message", async (msg) => {
    if (msg.author.bot) return;
    /**
     * Help command
     *  Tells users what commands there are
     *  __ is underline ** is bold
     */
    if (msg.content.toString() == "!!help") {
        msg.reply(`**Commands:**
        __!!rayne__ - tells a random fact
        __!!roulette__ - plays a simple game
        __!!balance__ - check your balance
        __!!coinflip <heads | tails> <bet amount>__ - play 50/50  
        
        Or type a question followed by '??' for a yes/no answer.
        `);
        return;
    }

    /**
     * 69
     *  Fun message is sent if prior message was 69 chars long
     */
    if (msg.content.length == 69) {
        msg.reply("That message was a nice length ;)");
        return;
    }

    /**
     * ??
     *  Yes/no answers to questions
     *  Switch statement helps with proabilty. (More yes'!)
     */
    if (msg.content.includes("??")) {
        const s = getRandomInt(7);
        switch (s) {
            case 3:
                msg.reply("Sure.");
                break;
            case 2:
                msg.reply("No.");
                break;
            case 1:
                msg.reply("Perhaps.");
                break;
            default:
                msg.reply("Yes.");
                break;
        }
        return;
    }

    /**
     * Rayne
     *  Tells user a random face
     */
    if (msg.content.toString() == "!!rayne") {
        const res = await fetch(
            "https://www.mentalfloss.com/api/facts?page=2&limit=1&cb=0.3276683361034485"
        ).then((response: any) => response.json());
        const message = "**Random fact:** " + res[0].fact;
        msg.channel.send(message);
        return;
    }

    /**
     * Roulette
     *  Play russian roulette
     */
    if (msg.content.toString() == "!!roulette") {
        switch (getRandomInt(5)) {
            case 0:
                msg.reply("💥🔫 Sorry you lost.");
                break;
            default:
                msg.reply("💦🔫 Whew. You're safe.");
                break;
        }
        return;
    }

    /*************************************
     *             Economy               *
     *************************************/

    //Currency symbol: ₦
    var args = msg.content.split(" ").slice(1);

    /**
     * Admin command
     */
    if (msg.content.includes("!!addNips")) {
        if (msg.member!.user.id == "295035247718825984")
            eco.AddToBalance(args[0], args[1]);
        else msg.reply("No can do buckaroo.");
        return;
    }

    /**
     * Balance
     *  returns amount of nips someone has
     */
    if (msg.content == "!!balance" || msg.content == "!!bal") {
        var output = await eco.FetchBalance(msg.author.id);
        msg.reply(`Your balance is ₦${output.balance}.00 nips.`);
        return;
    }

    /**
     * Coinflip
     * @author Eco
     */
    if (msg.content.includes("!!coinflip") || msg.content.includes("!!cf")) {
        var flip = args[0]; //Heads or Tails
        var amount = args[1]; //Coins to gamble

        if (!flip || !["heads", "tails"].includes(flip))
            return msg.reply("Please specify the flip, either heads or tails!");
        if (!amount) return msg.reply("Specify the amount you want to gamble!");

        var output = await eco.FetchBalance(msg.author.id);
        if (output.balance < amount)
            return msg.reply(
                "You have fewer ₦ than the amount you want to gamble!"
            );

        var gamble = await eco
            .Coinflip(msg.author.id, flip, amount)
            .catch(console.error);
        msg.reply(
            `You ${gamble.output}! New balance: ₦${gamble.newbalance}.00`
        );
        return;
    }

    /**
     * Blackjack
     * @author Christian Tobin
     */
    if (msg.content.includes("!!blackjack")) {
    }

    /**
     * Stocks
     * @author Christian Tobin
     */
    if (msg.content.includes("!!stocks")) {
        //arg[0] = command, arg[1] = stock name, arg[2] = # of shares,
        switch (args[0]) {
            case "buy":
                break;
            case "sell":
                break;
            default:
                break;
        }
    }

    if (msg.content.includes("!!leaderboard")) {
        let list = leaderboard();
        console.log(list);
        // msg.channel.send(`**Leaderboard**:
        // -----------------
        // 1. ${(await discord.users.fetch(list[0].userID)).username}:\t₦${
        //     list[0].balance
        // }.00
        // 2. ${(await discord.users.fetch(list[1].userID)).username}:\t₦${
        //     list[1].balance
        // }.00
        // 3. ${(await discord.users.fetch(list[2].userID)).username}:\t₦${
        //     list[2].balance
        // }.00
        // -----------------`);
    }
});
