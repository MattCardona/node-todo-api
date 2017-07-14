const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Testing todo text field';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find({text}).then((docs) => {
          expect(docs.length).toBe(1);
          expect(docs[0].text).toBe(text);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.find().then((docs) => {
        expect(docs.length).toBe(2);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.docs.length).toBe(2)
    })
    .end(done);
  });

});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.doc.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  });

});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    request(app)
    .delete(`/todos/${todos[1]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.doc._id).toBe(todos[1]._id.toHexString());
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
       Todo.findById({_id: todos[1]._id.toHexString()}).then((doc) => {
          expect(doc).toNotExist();
          done();
       }).catch((err) => {
          return done(err);
       })
    });
  });

  it('should return a 404 if todo not found', (done) => {
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 if ObjectID in invalid', (done) => {
    request(app)
    .delete('/todos/1234')
    .expect(404)
    .end(done);
  });

});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var id = todos[0]._id.toHexString();
    var text = 'Testing PATCH';
    request(app)
    .patch(`/todos/${id}`)
    .send({
      completed: true,
      text: text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.doc.text).toBe(text);
      expect(res.body.doc.completed).toBe(true);
      expect(res.body.doc.completedAt).toBeA('number');
    })
    .end(done)
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var id = todos[1]._id.toHexString();
    var text = 'Testing Clearing';
    request(app)
    .patch(`/todos/${id}`)
    .send({
      completed: false,
      text: text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.doc.text).toBe(text);
      expect(res.body.doc.completed).toBe(false);
      expect(res.body.doc.completedAt).toNotExist();
    })
    .end(done);
  });


});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
     request(app)
     .get('/users/me')
     .expect(401)
     .expect((res) => {
      expect(res.body).toEqual({});
     })
     .end(done);
  });

});

describe('Post /users', () => {
  it('should create a user', (done) => {
    var email = 'example@icloud.com';
    var password = '123asd!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      })
    });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = '132';
    var password = '123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = 'elvis@example.com';
    var password = 'abc123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  })

});