const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
    console.log(`New todo saved : ${doc}`);
  }, (err) => {
    res.status(400).send(err)
    console.log(`Error occured trying to save todo : ${err}`);
  });

});

app.get('/todos', (req, res) => {
  Todo.find().then((docs) => {
    res.send({docs});
  })
}, (err) => {
  res.status(400).send(err);
});

app.listen(port, () => {
  console.log(`Listening to port : ${port}`);
});

module.exports = { app };