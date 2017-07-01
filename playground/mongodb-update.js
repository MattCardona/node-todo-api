const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://yourUserNameAndPassword.mlab.com:41242/todos', (err, db) => {
  if(err){
    return console.log(err);
  }
  console.log("MongoDb server connected Dawg!");

  // db.collection('Todos').findOneAndUpdate(
  //   {_id: new ObjectID("59545a9b9655d703127a1129")},
  //   {
  //     $set: {text: "make dinner", completed: true}
  //   }, {
  //     returnOrignal: false
  //   }
  //   ).then((result) => {
  //     console.log(`The result : ${JSON.stringify(result, undefined, 2)}`);
  //   })
db.collection('Users').findOneAndUpdate(
    {_id: new ObjectID( "5955403f734d1d5e432627a9")},
    {
      $set: {name: "ElvisPelvis"},
      $inc: {age: -1}
    }, {
      returnOriginal: false
    }
    ).then((result) => {
      console.log(`The result : ${JSON.stringify(result, undefined, 2)}`);
    })
  // db.close();
})