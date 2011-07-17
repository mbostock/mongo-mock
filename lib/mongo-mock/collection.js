var cursor = require("./cursor"),
    ObjectId = require("./object_id");

module.exports = collection;

function collection(id, options) {
  var collection = [];

  function find(query, options, callback) {
    if (!callback) { callback = options; options = null; }
    var objects = collection.filter(filter(query));
    if (options) {
      if (options.sort) options.sort(sorter(options.sort));
      if (options.skip || ("limit" in options)) {
        var i = options.skip || 0;
        objects = objects.slice(i, i + (options.limit || Infinity));
      }
      if (options.fields) options = options.map(mapper(option.fields));
    }
    callback(null, cursor(objects));
  }

  function insert(objects, options, callback) {
    if (!callback) { callback = options; options = null; }
    if (Array.isArray(objects)) {
      var i = -1, n = objects.length, object;
      while (++i < n) {
        object = objects[i];
        if (!("_id" in object)) object._id = new ObjectId();
        collection.push(object);
      }
    } else {
      if (!("_id" in objects)) objects._id = new ObjectId();
      collection.push(objects);
    }
    if (callback) callback(null);
  }

  function update(query, object, options, callback) {
    if (!callback) { callback = options; options = null; }
    callback({message: "Not yet implemented."});
  }

  function save(object, options, callback) {
    if ("_id" in object) update({_id: object._id}, object, options, callback);
    else insert(object, options, callback);
  }

  function remove(query, options, callback) {
    if (!callback) { callback = options; options = null; }
    callback({message: "Not yet implemented."});
  }

  return {
    find: find,
    insert: insert,
    update: update,
    save: save,
    remove: remove,
    toString: function() { return id; }
  };
}

// TODO report errors when operator is unknown
function filter(fields) {
  var predicates = [],
      key,
      operator,
      value,
      special;

  for (var field in fields) {
    value = fields[field];
    if (typeof value === "object") {
      special = false;
      for (key in value) {
        if (key.charAt(0) === "$") {
          special = true;
          operator = operators[key];
          if (key === "$regex") {
            key = new RegExp(value[key], value.$options || "");
          } else if (!operator) {
            continue; // ignore
          } else {
            key = value[key];
          }
          predicates.push(predicate(field, operator, key));
        }
      }
      if (special) continue;
    }
    predicates.push(predicate(field, equals, value));
  }

  function predicate(name, operator, value) {
    var names = name.split("."),
        n = names.length;
    return function(object) {
      var i = -1, name;
      while (++i < n) {
        if (!((name = names[i]) in object)) return false;
        object = object[name];
      }
      return operator(object, value);
    };
  }

  return function(object) {
    var i = -1, n = predicates.length;
    while (++i < n) if (!predicates[i](object)) return false;
    return true;
  };
}

// TODO
function sorter(sort) {
  return function(a, b) {
    return 0;
  };
}

// TODO
function mapper(fields) {
  return function(object) {
    return object;
  };
}

// TODO object id equality
// TODO date equality
// TODO deep object equality
// TODO deep array equality
function equals(a, b) {
  return a == b;
}

// TODO $all
// TODO $exists
// TODO $mod
// TODO $in
// TODO $nin
// TODO $or
// TODO $size
// TODO $type
// TODO $elemMatch
// TODO $not
// TODO $where
var operators = {
  $gt: function(a, b) { return a > b; },
  $gte: function(a, b) { return a >= b; },
  $lt: function(a, b) { return a < b; },
  $lte: function(a, b) { return a <= b; },
  $ne: function(a, b) { return !equals(a, b); },
  $regex: function(a, b) { return b.test(a); }
};
