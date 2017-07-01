const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://yourUserNameAndPassword.mlab.com:41242/todos', (err, db) => {
  if(err){
    return console.log(err);
  }
  console.log("MongoDb server connected Dawg!");

  //deleteMany
    // db.collection('Todos').deleteMany({text: "clean bathroom"}).then((result) => {
    //   console.log(`Result deleted ${result}`);
    // })
  //deleteOne
    //  db.collection('Todos').deleteOne({text: "clean bathroom"}).then((result) => {
    //   console.log(`Result deleted ${result}`);
    // })
  //findOneAndDelete
  //    db.collection('Todos').findOneAndDelete({text: "clean bathroom"}).then((result) => {
  //   console.log(`Result deleted ${JSON.stringify(result, undefined, 2)}`);
  // })
 db.collection('Users').deleteMany({_id: new ObjectID("59553fba734d1d5e43262767")}).then((result) => {
    console.log(`Result deleted ${JSON.stringify(result, undefined, 2)}`);
  })

  // db.close();
})