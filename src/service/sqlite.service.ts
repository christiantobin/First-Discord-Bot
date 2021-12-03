const db = require("better-sqlite3")("database.sqlite", {
    verbose: console.log,
});

var list_stmt = db.prepare(
    "SELECT userID, balance FROM Economies ORDER BY balance DESC LIMIT 3"
);

export function leaderboard() {
    let list = [];
    for (const row of list_stmt.iterate()) {
        list.push({
            userID: String(row.userID),
            balance: String(row.balance),
        });
    }
    return list;
}

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
