const db = require("better-sqlite3")("database.sqlite", {
    verbose: console.log,
});

function leaderboard() {
    var list_stmt = db.prepare(
        "SELECT userID, balance FROM Economies ORDER BY balance DESC LIMIT 3"
    );
    var list = [];
    for (const row of list_stmt.iterate()) {
        console.log("in loop");
        list.push({
            userID: String(row.userID),
            balance: String(row.balance),
        });
    }
    return list;
}

console.log(leaderboard());
