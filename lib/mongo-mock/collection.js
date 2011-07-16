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

// TODO advanced query operators ($gt, $lt, etc.)
function filter(fields) {
  var predicates = [];

  for (var field in fields) {
    predicates.push(predicate(field, fields[field]));
  }

  function predicate(name, value) {
    var names = name.split("."),
        n = names.length;
    return function(o) {
      var i = -1, name;
      while (++i < n) {
        if (!((name = names[i]) in o)) return false;
        o = o[name];
      }
      return equals(o, value);
    };
  }

  return function(o) {
    var i = -1, n = predicates.length;
    while (++i < n) if (!predicates[i](o)) return false;
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
  return function(o) {
    return o;
  };
}

// TODO object id equality
// TODO date equality
// TODO deep object equality
// TODO deep array equality
function equals(a, b) {
  return a == b;
}
