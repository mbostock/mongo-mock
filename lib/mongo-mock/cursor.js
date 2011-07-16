module.exports = cursor;

function cursor(objects) {
  var i = -1;
  return {
    each: function(callback) {
      objects.forEach(function(object) { callback(null, object); });
      callback(null, null);
    },
    toArray: function(callback) {
      callback(null, objects);
    },
    nextObject: function(callback) {
      callback(null, ++i < objects.length? objects[i] : null);
    }
  };
}
