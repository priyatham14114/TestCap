namespace onPrem.db;
using { parkingsrv } from '../srv/external/parkingsrv';

// using { ZPARKING_SLOTS_SSet, ZPARKING_RESERVE_SSet, ZPARKING_HISTORYSet } from '../srv/external/parkingsrv';


entity ZPARKING_SLOTS_SSet as projection on parkingsrv.ZPARKING_SLOTS_SSet{

 Slotnumbers,
 Status,
 Assignedvehiclenumber,
 Assigneddrivername,
 Assigneddrivermobile,
 Assigneddeliverytype,
 Assignedcheckintime,
 VendorName

};
entity ZPARKING_RESERVE_SSet as projection on parkingsrv.ZPARKING_RESERVE_SSet{

Uuid,
Drivername,
Drivermobile,
Vehiclenumber,
Reservedslot,
Reserveddate,
Vendorname

};
entity ZPARKING_HISTORYSet as projection on parkingsrv.ZPARKING_HISTORYSet{
Uuid,
Drivername,
Drivermobile,
Vehiclenumber,
Deliverytype,
Historyslotnumber,
VendorName,
Checkintime,
Checkouttime
};