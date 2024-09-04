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

});
