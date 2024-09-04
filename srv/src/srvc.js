const cds = require("@sap/cds");

const getService = async (sEntityName) => {
    const oSrv = await cds.connect.to(sEntityName);
    return oSrv;
}

module.exports = {
    getService
}