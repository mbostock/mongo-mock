var mongodb = require("../");

var server = new mongodb.Server("host", 27017),
    db = new mongodb.Db("database", server);

console.log("db:");
console.log("  host:27017/database -> " + db);
console.log("");
