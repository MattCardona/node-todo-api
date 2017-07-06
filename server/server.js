const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
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
}, (err) => {
  res.status(400).send(err);
  });
});

//GET /todos/_id#
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    console.log(`The id ${id} is invalid!`);
    return res.status(404).send();
  }

  Todo.findById(id).then((doc) => {
    if(!doc){
      return res.status(404).send();
    }
    res.status(200).send({doc});
  }).catch((err) => {
    res.status(400).send()
  });

});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    console.log(`The id ${id} is invalid!`);
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((doc) => {
    if(!doc){
      return res.status(404).send();
    }
    console.log(`Your doc : ${JSON.stringify(doc, undefined, 2)} has been successfully removed.`);
    return res.status(200).send({doc});
  }).catch((err) => {
    return res.status(400).send();
  });

});

app.listen(port, () => {
  console.log(`Listening to port : ${port}`);
});

module.exports = { app };