const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var connect = mongoose.createConnection(process.env.MONGODB_URI);
module.exports = {
  mongoose: connect,
}