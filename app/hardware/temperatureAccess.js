/**
 * Created by wassi on 19.01.14.
 */

//TODO: zwei sensoren,
//innerer schmeisst event bei Überhitzung und abkühlung (einschalten/ausschalten von licht!)

var hardwareAccess = require('./hardwareAccess');
//TODO: use lookup table/correct function
var map = function(v){
    return v/10.24;
};

exports.getOuterTemperature = function(){
    //TODO: aus Modell lesen
    hardwareAccess.getSensor(7,'spi',map);
};


exports.getInnerTemperature = function(){
    //TODO: aus Modell lesen
    hardwareAccess.getSensor(6,'spi',map);
};