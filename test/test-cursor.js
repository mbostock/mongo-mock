var cursor = require("../lib/mongo-mock/cursor"); // Internal API!

var c = cursor([1, 2, 3]);
console.log("cursor([1, 2, 3]).each:");
c.each(function(error, object) {
  console.log("  " + object);
});
console.log("");

var c = cursor([1, 2, 3]);
console.log("cursor([1, 2, 3]).nextObject:");
c.nextObject(function(error, object) {
  console.log("  " + object);
  c.nextObject(function(error, object) {
    console.log("  " + object);
    c.nextObject(function(error, object) {
      console.log("  " + object);
        c.nextObject(function(error, object) {
          console.log("  " + object);
        });
    });
  });
});
console.log("");

var c = cursor([1, 2, 3]);
console.log("cursor([1, 2, 3]).toArray:");
c.toArray(function(error, objects) {
  console.log("  " + objects);
});
console.log("");
