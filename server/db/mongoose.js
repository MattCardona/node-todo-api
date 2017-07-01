const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var connect = mongoose.createConnection('mongodb://yourUserNameAndPassword.mlab.com:41242/todos');

module.exports = {
  mongoose: connect
}