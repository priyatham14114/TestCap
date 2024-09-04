using { onPrem.db as db } from '../db/schema';


@path: '/OnPremSRV'
service OnPremiseSRV {
    entity ZPARKING_SLOTS_SSet as projection on db.ZPARKING_SLOTS_SSet;
    entity ZPARKING_RESERVE_SSet as projection on db.ZPARKING_RESERVE_SSet;
    entity ZPARKING_HISTORYSet as projection on db.ZPARKING_HISTORYSet;
}
