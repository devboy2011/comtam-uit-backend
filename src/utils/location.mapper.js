const { REQ_LOCATIONS, RES_LOCATIONS } = require('../utils/enums');

exports.requestToresponseLocation = (location) => {
    if (location == REQ_LOCATIONS.HN) {
        return RES_LOCATIONS.HN;
    }
    
    if (location == REQ_LOCATIONS.HCM) {
        return RES_LOCATIONS.HCM;
    }
    
    if (location == REQ_LOCATIONS.DL) {
        return RES_LOCATIONS.DL;
    }
    
    if (location == REQ_LOCATIONS.DN) {
        return RES_LOCATIONS.DN;
    }
}