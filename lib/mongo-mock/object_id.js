var now = 0x4e21d7d4,
    machine_id = 0x0123ab,
    process_id = 0x0123,
    increment = 0;

module.exports = function ObjectId(id) {
  if (id == null) id = hex(++now, 8)
      + hex(machine_id, 6)
      + hex(process_id, 4)
      + hex(++increment, 6);
  this.toString = this.toJSON = function() { return id; };
};

function hex(n, width) {
  var length = (n = n.toString(16)).length;
  return length < width ? new Array(width - length + 1).join("0") + n : n;
}
