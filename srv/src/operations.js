const { getService } = require("./srvc");
const cds = require("@sap/cds");
const axios = require('axios');


const getData = async (req) => {
  const oSrv = await getService("parkingsrv");
  return oSrv.tx(req).run(req.query);
};

// token generation

// const getCSRFToken = async () => {
//   try {
//     const response = await axios.get('http://vhcalakeci.artihcus.com:50600/sap/opu/odata/sap/ZPARKING_APP_SRVC_S_SRV', {
//       headers: {
//         'X-CSRF-Token': 'Fetch',
//         'Authorization': 'Basic ' + Buffer.from('psubash:Subhash@47').toString('base64')
//       }
//     });
//     return {
//             csrfToken: response.headers["x-csrf-token"],
//             cookies: response.headers["set-cookie"] // Capture session cookies
//           };
//   } catch (error) {
//     console.error('Error fetching CSRF token:', error);
//     throw error;
//   }
// };

// const createData = async (req) => {
//   const {csrfToken,cookies} = await getCSRFToken();
//   console.log("hey im csrf token " + csrfToken)
//   console.log("hey im cookie" + cookies)
  
//   const oSrv = await getService("parkingsrv");
//   const oPayload = req.data;
//   const oResult = await oSrv.send("POST", "/ZPARKING_RESERVE_SSet", oPayload, {
//     headers: {
//       'Content-Type': 'application/json', // Ensure correct content type
//       'X-CSRF-Token': csrfToken,
//       // 'Authorization': 'Basic ' + Buffer.from('psubash:Subhash@47').toString('base64'),
//       'Cookie': cookies // Pass session cookies
//     }
//   });
//   return oResult;
// }

// working Axios call

// token generation
// working
// Function to fetch CSRF token
const getCSRFToken = async () => {
  try {
    const response = await axios.get('http://vhcalakeci.artihcus.com:50600/sap/opu/odata/sap/ZPARKING_APP_SRVC_S_SRV', {
      headers: {
        'X-CSRF-Token': 'Fetch',
        'Authorization': 'Basic ' + Buffer.from('psubash:Subhash@47').toString('base64')
      }
    });
    return {
      csrfToken: response.headers["x-csrf-token"],
      cookies: response.headers["set-cookie"] // Capture session cookies
    };
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

// Function to create data
const createData = async (req) => {
  try {
    const { csrfToken, cookies } = await getCSRFToken(); // Fetch CSRF token and cookies
    console.log("Fetched CSRF token: " + csrfToken);

    // Define payload
    const oPayload = req.data;

    // Send POST request
    const response = await axios.post('http://vhcalakeci.artihcus.com:50600/sap/opu/odata/sap/ZPARKING_APP_SRVC_S_SRV/ZPARKING_RESERVE_SSet', oPayload, {
      headers: {
        'Content-Type': 'application/json', // Ensure correct content type
        'X-CSRF-Token': csrfToken,
        'Authorization': 'Basic ' + Buffer.from('psubash:Subhash@47').toString('base64'),
        'Cookie': cookies // Pass session cookies
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating data:', error);
    throw error;
  }
};

// working Axios call end 


// UPDATE
// const updateDate = async (req) => {
//   const oSrv = await cds.connect.to("parkingsrv");
//   const oPayload = req.data;
//   const { Slotnumbers } = oPayload; // Assuming 'ID' is the key of the entity to update

//   try {
//     const oResult = await oSrv.send("PUT",`/ZPARKING_SLOTS_SSet(${Slotnumbers})`, oPayload);
//     // console.log(oPayload);
//     return oResult;
//   } catch (error) {
//     console.error("Error updating the record:", error);
//     req.error(500, "Failed to update the record.");
//   }
// };


module.exports = {
  getData,
  createData,
  // updateDate
};
