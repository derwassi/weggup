/**
 * Created by wassi on 19.01.14.
 */

//TODO: zwei sensoren,
//innerer schmeisst event bei Überhitzung und abkühlung (einschalten/ausschalten von licht!)

var hardwareAccess = require('./hardwareAccess');

exports.getOuterTemperature = function(){
    //TODO: aus Modell lesen
    hardwareAccess.getSensor(0,'spi');
};


exports.getInnerTemperature = function(){
    //TODO: aus Modell lesen
    hardwareAccess.getSensor(1,'spi');
};