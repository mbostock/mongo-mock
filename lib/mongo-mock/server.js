module.exports = Server;

function Server(host, port, options) {
  var id = host + ":" + port;
  this.toString = function() { return id; };
}
