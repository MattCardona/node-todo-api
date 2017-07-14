const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';
bcrypt.genSalt(10, (err, salt)=>{
  if(err){
    return err;
  }
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  })
})
var hashed = '$2a$10$.8H3P2U41bcsAzpONNRcmOKFJPesr0PpWXSnn3nU5BkLxjFUFkpX2';
bcrypt.compare(password, hashed, (err, result) => {
  console.log(result);
})



// var data = {
//   id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Reg message: ${message}`);
// console.log(`Message hashed ${hash}`);

// var data = {
//   id: 4
// };

// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash){
//   console.log('Data was not changed');
// }else {
//   console.log('Data was changed. Do not trust!');
// }