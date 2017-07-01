const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://yourUserNameAndPassword.mlab.com:41242/todos', (err, db) => {
  if(err){
    return console.log(err);
  }
  console.log("MongoDb server connected Dawg!");

  // db.collection('Todos').find({
  //   _id: new ObjectID("59545a9b9655d703127a1129")
  // }).toArray().then((docs) => {
  //   console.log("Todos");
  //   console.log(`${JSON.stringify(docs, undefined, 2)}`);
  // }, (err) => {
  //   console.log(`Unable to fetch todos ${err}`);
  // });
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count : ${count}`);
  // }, (err) => {
  //   console.log(`Unable to fetch todos ${err}`);
  // });
  db.collection('Users').find().toArray().then((docs) => {
    console.log(`Users : ${JSON.stringify(docs[1], undefined, 2)}`);
  }, (err) => {
    console.log(`Unable to fetch Users ${err}`);
  });
  db.close();
})