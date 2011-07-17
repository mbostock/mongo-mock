var mongodb = require("../"),
    ObjectId = mongodb.ObjectId;

var server = new mongodb.Server("host", 27017),
    db = new mongodb.Db("database", server);

console.log("collection:");
db.open(function(error) {
  db.collection("collection", function(error, collection) {
    console.log("  host:27017/database/collection -> " + collection);
  });
});
console.log("");

db.open(function(error) {
  db.collection("empty", function(error, collection) {
    collection.find({}, log("empty + find"));
  });
});

db.open(function(error) {
  db.collection("insert", function(error, collection) {
    collection.insert({hello: "world"}, function(error) {
      collection.find({}, log("insert(object)"));
    });
  });
});

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
      collection.find({}, log("insert(objects)"));
    });
  });
});

db.open(function(error) {
  db.collection("inserts", function(error, collection) {
    collection.find({string: "string"}, log("find(string = \"string\")"));
    collection.find({number: 42}, log("find(number = 42)"));
    collection.find({number: {$gte: 42}}, log("find(number >= 42)"));
    collection.find({number: {$gt: 41}}, log("find(number > 41)"));
    collection.find({number: {$lte: 42}}, log("find(number <= 42)"));
    collection.find({number: {$lt: 43}}, log("find(number < 43)"));
    collection.find({number: {$gt: 41, $lt: 43}}, log("find(number < 43 and number > 41)"));
    collection.find({number: {$ne: 42}}, log("find(number != 42)"));
    collection.find({number: {$lt: 42}}, log("find(number < 42)"));
    collection.find({number: {$lte: 41}}, log("find(number <= 41)"));
    collection.find({number: {$gt: 42}}, log("find(number > 42)"));
    collection.find({number: {$gte: 43}}, log("find(number >= 43)"));
    collection.find({number: {$lte: 41, $gte: 43}}, log("find(number >= 43 and number <= 41)"));
    collection.find({boolean: true}, log("find(boolean = true)"));
    collection.find({boolean: false}, log("find(boolean = false)"));
    collection.find({boolean: {$ne: true}}, log("find(boolean != true)"));
    collection.find({null: null}, log("find(null = null)"));
    collection.find({string: {$gt: "strinf"}}, log("find(string > strinf)"));
    collection.find({string: {$lt: "strinh"}}, log("find(string < strinh)"));
    collection.find({string: {$regex: "^STR", $options: "i"}}, log("find(/^STR/i.test(string))"));
    collection.find({"object.boolean": true, "object.number": {$gt: -1}}, log("find(object.boolean = true and object.number > 41)"));
    collection.find({date: new Date(2011, 0, 1)}, log("find(date = 2011-01-01)"));
    collection.find({date: {$gte: new Date(2011, 0, 1)}}, log("find(date >= 2011-01-01)"));
    collection.find({date: {$gt: new Date(2010, 11, 31)}}, log("find(date > 2010-12-31)"));
    collection.find({date: {$lte: new Date(2011, 0, 1)}}, log("find(date <= 2011-01-01))"));
    collection.find({date: {$lt: new Date(2011, 0, 2)}}, log("find(date < 2011-01-02)"));
    collection.find({date: {$gt: new Date(2010, 11, 31), $lt: new Date(2011, 0, 2)}}, log("find(date < 2011-01-02 and date > 2010-12-31)"));
    collection.find({date: {$ne: new Date(2011, 0, 1)}}, log("find(date != 2011-01-01)"));
    collection.find({date: {$lt: new Date(2011, 0, 1)}}, log("find(date < 2011-01-01)"));
    collection.find({date: {$lte: new Date(2010, 11, 31)}}, log("find(date <= 2010-12-31)"));
    collection.find({date: {$gt: new Date(2011, 0, 1)}}, log("find(date > 2011-01-01)"));
    collection.find({date: {$gte: new Date(2011, 0, 2)}}, log("find(date >= 2011-01-02)"));
    collection.find({date: {$lte: new Date(2010, 11, 31), $gte: new Date(2011, 0, 2)}}, log("find(date >= 2011-01-02 and date <= 2010-12-31)"));
    collection.find({_id: new ObjectId("4e21d7d80123ab0123000004")}, log("find(_id = ObjectId(4e21d7d80123ab0123000004))"));
    collection.find({array: [1, 2, "three"]}, log("find(array = [1,2,\"three\"])"));
  });
});

db.open(function(error) {
  db.collection("save", function(error, collection) {
    var object = {hello: "world"};
    collection.save(object, function(error) {
      collection.find({}, log("save(new)"));
      collection.save(object, function(error) {
        collection.find({}, log("save(existing)"));
        object.hello = 2;
        object.foo = "bar";
        collection.save(object, function(error) {
          collection.find({}, log("save(updated)"));
        });
      });
    });
  });
});

function log(message) {
  return function(error, cursor) {
    console.log(message + ":");
    cursor.each(function(error, object) {
      if (object) console.log("  " + JSON.stringify(object));
      else console.log("");
    });
  };
}
