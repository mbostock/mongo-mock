var cursor = require("./cursor"),
    ObjectId = require("./object_id");

module.exports = collection;

function collection(id, options) {
  var collection = [];

  function find(query, options, callback) {
    if (typeof options === "function") { callback = options; options = null; }
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

  // TODO detect duplicates
  function insert(objects, options, callback) {
    if (typeof options === "function") { callback = options; options = null; }
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

  // TODO $ positional operator
  function update(query, object, options, callback) {
    if (typeof options === "function") { callback = options; options = null; }
    var single = !(options && options.multi),
        found = false,
        f = filter(query),
        i = -1,
        n = collection.length,
        o;

    function u(o) {
      var special = false,
          operator;
      for (var key in object) {
        if (key.charAt(0) === "$") {
          special = true;
          operator = update_operators[key];
          if (operator) operator(o, object[key]);
        }
      }
      return special ? o : JSON.parse(JSON.stringify(object));
    }

    while (++i < n) {
      if (f(o = collection[i])) {
        (collection[i] = u(o))._id = o._id;
        found = true;
        if (single) break;
      }
    }

    if (!found && options && options.upsert) {
      if (!("_id" in object)) object._id = new ObjectId();
      collection.push(object);
    }

    if (callback) callback(null);
  }

  function save(object, options, callback) {
    if ("_id" in object) update({_id: object._id}, object, options, callback);
    else insert(object, options, callback);
  }

  function remove(query, options, callback) {
    if (typeof options === "function") { callback = options; options = null; }
    var f = filter(query);
    collection = collection.filter(function(o) { return !f(o); });
    if (callback) callback(null);
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

// TODO search arrays (e.g., "comments.by": "joe" in comments: [{by: "joe"}])
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
          operator = filter_operators[key];
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

function equals(a, b) {
  if (a === b) return true;
  var ta = typeof a, tb = typeof b;
  if (ta !== tb) return false;
  if (a == b) return true;
  if (ta !== "object") return false;
  if (a instanceof Array) return b instanceof Array && equalsArray(a, b);
  if (a instanceof Date) return b instanceof Date && !(a - b);
  if (a instanceof ObjectId) return b instanceof ObjectId && ((a + "") === (b + ""));
  return equalsObject(a, b);
}

function equalsArray(a, b) {
  var i = -1, n = a.length;
  if (n !== b.length) return false;
  while (++i < n) if (!equals(a[i], b[i])) return false;
  return true;
}

function equalsObject(a, b) {
  var k;
  for (k in a) {
    if (k in b) {
      if (!equals(a[k], b[k])) return false;
    } else {
      return false;
    }
  }
  for (k in b) {
    if (!(k in a)) {
      return false;
    }
  }
  return true;
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
var filter_operators = {
  $gt: function(a, b) { return a > b; },
  $gte: function(a, b) { return a >= b; },
  $lt: function(a, b) { return a < b; },
  $lte: function(a, b) { return a <= b; },
  $ne: function(a, b) { return !equals(a, b); },
  $regex: function(a, b) { return b.test(a); }
};


// TOOD $inc
// TODO $push
// TODO $pushAll
// TODO $addToSet
// TODO $pop
// TODO $pull
// TODO $pullAll
// TODO $rename
// TODO $bit
var update_operators = {
  $set: function(object, value) {
    for (var key in value) {
      var keys = key.split("."), i = -1, n = keys.length - 1, o = object;
      while (++i < n) {
        if (!(keys[i] in o)) return;
        o = o[keys[i]];
      }
      o[keys[i]] = value[key];
    }
  },
  $unset: function(object, value) {
    for (var key in value) {
      var keys = key.split("."), i = -1, n = keys.length - 1, o = object;
      while (++i < n) {
        if (!(keys[i] in o)) return;
        o = o[keys[i]];
      }
      delete o[keys[i]];
    }
  }
};
