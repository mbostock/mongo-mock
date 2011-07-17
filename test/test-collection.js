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
    console.log("find(number >= 42):");
    collection.find({number: {$gte: 42}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number > 41):");
    collection.find({number: {$gt: 41}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number <= 42):");
    collection.find({number: {$lte: 42}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number < 43):");
    collection.find({number: {$lt: 43}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number < 43 and number > 41):");
    collection.find({number: {$gt: 41, $lt: 43}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number != 42):");
    collection.find({number: {$ne: 42}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number < 42):");
    collection.find({number: {$lt: 42}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number <= 41):");
    collection.find({number: {$lte: 41}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number > 42):");
    collection.find({number: {$gt: 42}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number >= 43):");
    collection.find({number: {$gte: 43}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(number >= 43 and number <= 41):");
    collection.find({number: {$lte: 41, $gte: 43}}, function(error, cursor) {
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
    console.log("find(boolean = false):");
    collection.find({boolean: false}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(boolean != true):");
    collection.find({boolean: {$ne: true}}, function(error, cursor) {
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
    console.log("find(string > strinf):");
    collection.find({string: {$gt: "strinf"}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(string < strinh):");
    collection.find({string: {$lt: "strinh"}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(/^STR/i.test(string)):");
    collection.find({string: {$regex: "^STR", $options: "i"}}, function(error, cursor) {
      cursor.each(function(error, object) {
        if (object) console.log("  " + JSON.stringify(object));
        else console.log("");
      });
    });
    console.log("find(object.boolean = true and object.number > 41):");
    collection.find({"object.boolean": true, "object.number": {$gt: -1}}, function(error, cursor) {
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
