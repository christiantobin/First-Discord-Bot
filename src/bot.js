"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch = require("node-fetch");
var dotenv = require("dotenv").config();
var eco = require("discord-economy");
var discord_js_1 = require("discord.js");
var client = new discord_js_1.Client();
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
client.login(process.env.DISCORDJS_BOT_TOKEN);
client.on("ready", function () {
    console.log("READY FOR ACTION!");
    client.user.setActivity("!!help.", { type: "LISTENING" });
});
client.on("message", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var s, res, message, args, output, flip, amount, output, gamble, id, un;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (msg.author.bot)
                    return [2 /*return*/];
                /**
                 * Help command
                 *  Tells users what commands there are
                 *  __ is underline ** is bold
                 */
                if (msg.content.toString() == "!!help") {
                    msg.reply("**Commands:**\n        __!!rayne__ - tells a random fact\n        __!!roulette__ - plays a simple game\n        __!!balance__ - check your balance\n        __!!coinflip <heads | tails> <bet amount>__ - play 50/50  \n        \n        Or type a question followed by '??' for a yes/no answer.\n        ");
                    return [2 /*return*/];
                }
                /**
                 * 69
                 *  Fun message is sent if prior message was 69 chars long
                 */
                if (msg.content.length == 69) {
                    msg.reply("That message was a nice length ;)");
                    return [2 /*return*/];
                }
                /**
                 * ??
                 *  Yes/no answers to questions
                 *  Switch statement helps with proabilty. (More yes'!)
                 */
                if (msg.content.includes("??")) {
                    s = getRandomInt(7);
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
                    return [2 /*return*/];
                }
                if (!(msg.content.toString() == "!!rayne")) return [3 /*break*/, 2];
                return [4 /*yield*/, fetch("https://www.mentalfloss.com/api/facts?page=2&limit=1&cb=0.3276683361034485").then(function (response) { return response.json(); })];
            case 1:
                res = _a.sent();
                message = "**Random fact:** " + res[0].fact;
                msg.channel.send(message);
                return [2 /*return*/];
            case 2:
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
                    return [2 /*return*/];
                }
                args = msg.content.split(" ").slice(1);
                /**
                 * Admin command
                 */
                if (msg.content.includes("!!addNips")) {
                    if (msg.member.user.id == "295035247718825984")
                        eco.AddToBalance(args[0], args[1]);
                    else
                        msg.reply("No can do buckaroo.");
                    return [2 /*return*/];
                }
                if (!(msg.content == "!!balance" || msg.content == "!!bal")) return [3 /*break*/, 4];
                return [4 /*yield*/, eco.FetchBalance(msg.author.id)];
            case 3:
                output = _a.sent();
                msg.reply("Your balance is \u20A6" + output.balance + ".00 nips.");
                return [2 /*return*/];
            case 4:
                if (!(msg.content.includes("!!coinflip") || msg.content.includes("!!cf"))) return [3 /*break*/, 7];
                flip = args[0];
                amount = args[1];
                if (!flip || !["heads", "tails"].includes(flip))
                    return [2 /*return*/, msg.reply("Please specify the flip, either heads or tails!")];
                if (!amount)
                    return [2 /*return*/, msg.reply("Specify the amount you want to gamble!")];
                return [4 /*yield*/, eco.FetchBalance(msg.author.id)];
            case 5:
                output = _a.sent();
                if (output.balance < amount)
                    return [2 /*return*/, msg.reply("You have fewer ₦ than the amount you want to gamble!")];
                return [4 /*yield*/, eco
                        .Coinflip(msg.author.id, flip, amount)
                        .catch(console.error)];
            case 6:
                gamble = _a.sent();
                msg.reply("You " + gamble.output + "! New balance: \u20A6" + gamble.newbalance + ".00");
                return [2 /*return*/];
            case 7:
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
                if (!msg.content.includes("!!leaderboard")) return [3 /*break*/, 9];
                id = args[0];
                return [4 /*yield*/, client.users.fetch(id)];
            case 8:
                un = (_a.sent()).username;
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
