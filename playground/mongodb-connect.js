const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://yourUserNameAndPassword@ds141242.mlab.com:41242/todos', (err, db) => {
  if(err){
    return console.log(err);
  }
  console.log("MongoDb server connected Dawg!");

  db.collection('Todos').insertOne({
    text: 'clean bathroom',
    completed: false
  }, (err, result) => {
    if(err){
      return console.log(`Error in insertion ${err}`);
    }
    console.log(`Inserted one item in db ${JSON.stringify(result.ops, undefined, 2)}`);
  });
  // db.collection('Users').insertOne({
  //   name: "Ralph",
  //   age: 4,
  //   location: "BaconLand"
  // }, (err, result) => {
  //   if(err){
  //     return console.log(`A error occured in inserting a User in Users collection: ${err}`);
  //   }
  //   console.log(`Inserted on item in Users collection item was: ${JSON.stringify(result.ops, undefined, 2)}`);
  // })
  // db.collection('Todos').find({}).toArray((err, doc) => {
  //   if(err){
  //     return console.log(`error occured in finding ${err}`);
  //   }
  //   console.log(`Connected here are the docs man ${JSON.stringify(doc, undefined, 2)}`);
  // });

  db.close();
})