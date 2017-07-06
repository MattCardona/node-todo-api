const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

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