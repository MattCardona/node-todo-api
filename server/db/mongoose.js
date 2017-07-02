const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var connect = mongoose.createConnection(process.env.MONGODB_URI || 'mongodb://yourUserNameAndPassword@ds141242.mlab.com:41242/todos');

module.exports = {
  mongoose: connect
}