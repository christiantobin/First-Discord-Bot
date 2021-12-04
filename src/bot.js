const client = require("discord.js");
const db = require("better-sqlite3")("database.sqlite", {
    verbose: console.log,
});
const fetch = require("node-fetch");
const dotenv = require("dotenv").config();
const eco = require("discord-economy");
var request = require("request");

var discord = new client.Client();
discord.login(process.env.DISCORDJS_BOT_TOKEN);

discord.on("ready", function () {
    console.log("READY FOR ACTION!");
    discord.user.setActivity("!!help.", { type: "LISTENING" });
});
try {
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
        __!!roulette__ - plays a simple game (Earn +100 on win, -300 on lose)
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
            ).then((response) => response.json());
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
                    msg.reply("💥🔫 Sorry you lost. (-300 Nips)");
                    eco.SubtractFromBalance(msg.author.id, 300);
                    break;
                default:
                    msg.reply("💦🔫 Whew. You're safe. (+100 Nips)");
                    eco.AddToBalance(msg.author.id, 100);
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
            if (msg.member.user.id == "295035247718825984")
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
            msg.reply(`Your balance is ₦${output.balance} nips.`);
            return;
        }

        /**
         * Coinflip
         * @author Eco
         */
        if (
            msg.content.includes("!!coinflip") ||
            msg.content.includes("!!cf")
        ) {
            var flip = args[0]; //Heads or Tails
            var amount = args[1]; //Coins to gamble

            if (!flip || !["heads", "tails"].includes(flip))
                return msg.reply(
                    "Please specify the flip, either heads or tails!"
                );
            if (!amount)
                return msg.reply("Specify the amount you want to gamble!");

            var output = await eco.FetchBalance(msg.author.id);
            if (output.balance < amount)
                return msg.reply(
                    "You have fewer ₦ than the amount you want to gamble!"
                );

            var gamble = await eco
                .Coinflip(msg.author.id, flip, amount)
                .catch(console.error);
            msg.reply(
                `You ${gamble.output}! New balance: ₦${gamble.newbalance}`
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
            msg.channel.send(`**Leaderboard**:
----------------------------------------
1. ${(await discord.users.fetch(list[0].userID)).username}:\t₦${list[0].balance}
2. ${(await discord.users.fetch(list[1].userID)).username}:\t₦${list[1].balance}
3. ${(await discord.users.fetch(list[2].userID)).username}:\t₦${list[2].balance}
----------------------------------------`);
            return;
        }

        if (msg.content.includes("!!price")) {
            let symbol = args[0];
            var amount = 1;
            if (args[1]) amount = args[1];
            let price_in_dollars = await getStockPrice(symbol);
            console.log(price_in_dollars);
            if (price_in_dollars == undefined) {
                msg.reply('Cannot find symbol "' + symbol + '"');
                return;
            }
            let price = price_in_dollars * 100;
            msg.reply(
                "The price of " +
                    String(amount) +
                    " share(s) of " +
                    symbol +
                    " is ₦" +
                    String(price)
            );
            return;
        }

        if (msg.content.includes("!!buy")) {
            let symbol = args[0].toLocaleLowerCase();
            var amount = 1;
            if (args[1]) amount = args[1];
            let price_in_dollars = await getStockPrice(symbol);
            if (price_in_dollars == undefined) {
                msg.reply('Cannot find symbol "' + symbol + '"');
                return;
            }
            let price = price_in_dollars * 100;
            if (
                (await eco.FetchBalance(msg.author.id)).balance >=
                price * amount
            ) {
                updateStockDatabase(
                    msg.author.id,
                    "buy",
                    price,
                    amount,
                    symbol
                );
                eco.SubtractFromBalance(msg.author.id, price * Number(amount));
                msg.reply(
                    "You bought " + amount + " share(s) of " + symbol + "!"
                );
            } else {
                msg.reply("You do not have enough funds!");
            }
        }

        if (msg.content.includes("!!sell")) {
            let symbol = args[0].toLocaleLowerCase();
            var amount = 1;
            if (args[1]) amount = args[1];
            let price_in_dollars = await getStockPrice(symbol);
            if (price_in_dollars == undefined) {
                msg.reply('Cannot find symbol "' + symbol + '"');
                return;
            }
            let price = price_in_dollars * 100;
            let profit = updateStockDatabase(
                msg.author.id,
                "sell",
                price,
                amount,
                symbol
            );
            if (profit == "Invalid")
                msg.reply(
                    "Invalid: you do not own " +
                        String(amount) +
                        " share(s) of " +
                        symbol +
                        "."
                );
            else {
                await eco.AddToBalance(msg.author.id, price * Number(amount));
                if (profit > 0)
                    msg.reply("Sold for a net GAIN of ₦" + profit + "!");
                else if (profit == 0) msg.reply("Sold and BROKE EVEN!");
                else msg.reply("Sold for a net LOSS of " + profit + " Nips.");
            }
        }
    });
} catch (err) {
    discord.user.send(String(err));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function leaderboard() {
    var list_stmt = db.prepare(
        "SELECT userID, balance FROM Economies ORDER BY balance DESC LIMIT 3"
    );
    var list = [];
    for (const row of list_stmt.iterate()) {
        list.push({
            userID: String(row.userID),
            balance: String(row.balance),
        });
    }
    return list;
}

async function getStockPrice(symbol) {
    var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.API_KEY}`;
    return new Promise((resolve) => {
        request.get(
            {
                url: url,
                json: true,
                headers: { "User-Agent": "request" },
            },
            (err, res, data) => {
                if (err) {
                    console.log("Error:", err);
                } else if (res.statusCode !== 200) {
                    console.log("Status:", res.statusCode);
                } else {
                    // data is successfully parsed as a JSON object:
                    console.log(data);
                    try {
                        resolve(data["Global Quote"]["05. price"]);
                    } catch {
                        return undefined;
                    }
                }
            }
        );
    });
}

function getShareCount(userID, symbol) {
    try {
        var stmt = db.prepare(
            "SELECT * from stock_holders WHERE eco_id = ? AND symbol = ?"
        );
        return stmt.all(userID, symbol);
    } catch {
        return 0;
    }
}

function updateStockDatabase(userID, method, price, shares, symbol) {
    if (method == "buy") {
        var flag = 0;
        getShareCount(userID, symbol).forEach((row) => {
            if (symbol == row.symbol) {
                stmt = db
                    .prepare(
                        "UPDATE stock_holders SET shares = ?, updated_at = ? WHERE id = ?"
                    )
                    .run(
                        Number(row.shares) + Number(shares),
                        Date.now(),
                        row.id
                    );
                flag = 1;
            }
        });
        if (flag == 0) {
            stmt = db
                .prepare(
                    "INSERT INTO stock_holders (eco_id, symbol, bought_at, updated_at, original_price, shares) VALUES (?,?,?,?,?,?)"
                )
                .run(userID, symbol, Date.now(), Date.now(), price, shares);
        }
    } else if (method == "sell") {
        var profit = 0;
        var valid = 0;
        stmt = db
            .prepare("SELECT * FROM stock_holders WHERE eco_id = ?")
            .all(userID)
            .forEach((row) => {
                if (row.symbol == symbol)
                    if (row.shares >= shares) {
                        valid = 1;
                        stmt = db
                            .prepare(
                                "UPDATE stock_holders SET shares = ?, updated_at = ? WHERE id = ?"
                            )
                            .run(
                                Number(row.shares) - Number(shares),
                                Date.now(),
                                row.id
                            );
                    }
            });
        if (valid == 0) return "Invalid";
        else {
            return profit;
        }
    }
}
