const cds = require("@sap/cds");
const { getData, createData } = require("./src/operations");

module.exports = cds.service.impl(async function () {
  this.on("READ", "ZPARKING_SLOTS_SSet", getData);
  this.on("READ", "ZPARKING_RESERVE_SSet", getData);
  this.on("READ", "ZPARKING_HISTORYSet", getData);

  // CREATE
  this.on("CREATE", "ZPARKING_RESERVE_SSet", createData)

  // UPDATE
  // this.on("PUT", "ZPARKING_SLOTS_SSet", updateDate)



  // password check

  const bcrypt = require('bcrypt');

  // Number of salt rounds
  const saltRounds = 10;

  // Plain text password to hash
  const plainPassword = 'Subhash@47';

  // Hash the password
  bcrypt.hash(plainPassword, saltRounds, (err, hash_passwd) => {
    if (err) {
      console.error(err);
      return;
    }

    // Store hash in the database
    console.log('Hashed Password:', hash_passwd);

    bcrypt.compare("Subhash@47", hash_passwd, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }

      if (result) {
        console.log('Password match! User authenticated.');
      } else {
        console.log('Password does not match! Authentication failed.');
      }
    });

  });




});
