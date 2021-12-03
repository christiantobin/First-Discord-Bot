"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboard = void 0;
var db = require("better-sqlite3")("database.sqlite", {
    verbose: console.log,
});
var list_stmt = db.prepare("SELECT userID, balance FROM Economies ORDER BY balance DESC LIMIT 3");
function leaderboard() {
    var list = [];
    for (var _i = 0, _a = list_stmt.iterate(); _i < _a.length; _i++) {
        var row = _a[_i];
        list.push({
            userID: String(row.userID),
            balance: String(row.balance),
        });
    }
    return list;
}
exports.leaderboard = leaderboard;
/*
let count = 1;
db.each(
    "SELECT userID, balance FROM Economies ORDER BY balance DESC LIMIT 3",
    function (err, row) {
        if (err) throw err;
        console.log(count, row.userID, "₦" + String(row.balance) + ".00");
        count++;
    }
);*/
