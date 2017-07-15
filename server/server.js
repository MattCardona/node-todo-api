require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

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

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    console.log(`The id ${id} is invalid!`);
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((doc) => {
    if(!doc){
      return res.status(404).send();
    }
    res.status(200).send({doc});
  }).catch((err) => {
    res.status(400).send();
  });

});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then((doc) => {
    return doc.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
   }).catch((err) => {
    res.status(400).send(err)
    console.log(`Error occured trying to save user : ${err}`);
  });

});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user )
});

//POST /users/login sending in {email, password}
//
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((doc) => {
    return doc.generateAuthToken().then((token) =>{
      res.header('x-auth', token).send(doc);
    })
  }).catch((err) => {
    res.status(400).send();
  })
});

app.listen(port, () => {
  console.log(`Listening to port : ${port}`);
});

module.exports = { app };