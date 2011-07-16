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
        else console.log("");
      });
    });
  });
});

console.log("insert(object):");
db.open(function(error) {
  db.collection("insert", function(error, collection) {
    collection.insert({hello: "world"}, function(error) {
      collection.find({}, function(error, cursor) {
        cursor.each(function(error, object) {
          if (object) console.log("  " + JSON.stringify(object));
          else console.log("");
        });
      });
    });
  });
});

console.log("insert(objects):");
db.open(function(error) {
  db.collection("inserts", function(error, collection) {
    collection.insert([
      {string: "string"},
      {number: 42},
      {boolean: true},
      {null: null},
      {date: new Date(2011, 0, 1)},
      {object: {"boolean": true, "number": 42, "array": [1, 2, "three"]}},
      {array: [1, 2, "three"]}
    ], function(error) {
      collection.find({}, function(error, cursor) {
        cursor.each(function(error, object) {
          if (object) console.log("  " + JSON.stringify(object));
          else console.log("");
        });
      });
    });
  });
});

db.open(function(error) {
  db.collection("inserts", function(error, collection) {
    console.log("find(string = \"string\"):");
    collection.find({string: "string"}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number = 42):");
    collection.find({number: 42}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(boolean = true):");
    collection.find({boolean: true}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(null = null):");
    collection.find({null: null}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
  });
});

console.log("save(object) + find:");
db.open(function(error) {
  db.collection("save", function(error, collection) {
    collection.save({hello: "world"}, function(error) {
      collection.find({}, function(error, cursor) {
        cursor.each(function(error, object) {
          if (object) console.log("  " + JSON.stringify(object));
          else console.log("");
        });
      });
    });
  });
});
