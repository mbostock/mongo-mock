var cursor = require("./cursor"),
    ObjectId = require("./object_id");

module.exports = collection;

function collection(id, options) {
  var collection = [];

  function find(query, options, callback) {
    if (!callback) { callback = options; options = null; }
    callback(null, cursor(collection));
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
