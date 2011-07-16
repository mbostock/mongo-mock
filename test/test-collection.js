var mongodb = require("../");

var server = new mongodb.Server("host", 27017),
    db = new mongodb.Db("database", server);

console.log("collection:");
db.open(function(error) {
  db.collection("collection", function(error, collection) {
    console.log("  host:27017/database/collection -> " + collection);
  });
});
console.log("");

console.log("empty + find:");
db.open(function(error) {
  db.collection("empty", function(error, collection) {
    collection.find({}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
      });
    });
  });
});
console.log("");

console.log("insert(object) + find:");
db.open(function(error) {
  db.collection("insert", function(error, collection) {
    collection.insert({hello: "world"}, function(error) {
      collection.find({}, function(error, cursor) {
        cursor.each(function(error, object) {
          if (object) console.log("  " + JSON.stringify(object));
        });
      });
    });
  });
});
console.log("");

console.log("save(object) + find:");
db.open(function(error) {
  db.collection("save", function(error, collection) {
    collection.save({hello: "world"}, function(error) {
      collection.find({}, function(error, cursor) {
        cursor.each(function(error, object) {
          if (object) console.log("  " + JSON.stringify(object));
        });
      });
    });
  });
});
console.log("");
