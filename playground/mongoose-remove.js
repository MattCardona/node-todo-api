const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const{User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(`The removed results: ${result}`);
// });

//Todo.findOneAndRemove({});

// Todo.findByIdAndRemove("595af540f36d281ce2c426cf").then((result) => {
//   console.log(`The removed results: ${JSON.stringify(result, undefined, 2)}`);
// });