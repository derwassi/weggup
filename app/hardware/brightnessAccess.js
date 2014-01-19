/**
 * Created by wassi on 19.01.14.
 */

//TODO: ein sensor, schmeisst keine besonderen evnts
/**
 * Created by wassi on 19.01.14.
 */

//TODO: zwei sensoren,
//innerer schmeisst event bei Überhitzung und abkühlung (einschalten/ausschalten von licht!)

var hardwareAccess = require('./hardwareAccess');

exports.getAmbientBrightness = function(){
    //TODO: aus Modell lesen
    hardwareAccess.getSensor(2,'spi');
}

