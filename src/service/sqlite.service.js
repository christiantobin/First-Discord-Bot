const sql3 = require("sqlite3").verbose();
const db = new sql3.Database("database.sqlite");

console.log("Economies Columns:");
db.each("pragma table_info(Economies)", function (err, row) {
    if (err) throw err;
    console.log("\t", row.name);
});

console.log("\nstock_holders Columns:");
db.each("pragma table_info(stock_holders)", function (err, row) {
    if (err) throw err;
    console.log("\t", row.name);
});

let count = 1;
db.each(
    "SELECT userID, balance FROM Economies ORDER BY balance DESC LIMIT 3",
    function (err, row) {
        if (err) throw err;
        console.log(count, row.userID, "₦" + String(row.balance) + ".00");
        count++;
    }
);
