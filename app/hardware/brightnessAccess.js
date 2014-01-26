/**
 * Created by wassi on 19.01.14.
 */
/**
 * Created by wassi on 19.01.14.
 */

//innerer schmeisst event bei Überhitzung und abkühlung (einschalten/ausschalten von licht!)

var hardwareAccess = require('./hardwareAccess');
//map from 0 to 100 (arbitrarily chosen)
var map = function(v){
    return v/10.24
};
exports.getAmbientBrightness = function(){
    //TODO: aus Modell lesen
    return hardwareAccess.getSensor(4,'spi',map);
};

