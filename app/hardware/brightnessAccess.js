/**
 * Created by wassi on 19.01.14.
 */
/**
 * Created by wassi on 19.01.14.
 */

//innerer schmeisst event bei Überhitzung und abkühlung (einschalten/ausschalten von licht!)

var hardwareAccess = require('./hardwareAccess');

exports.getAmbientBrightness = function(){
    //TODO: aus Modell lesen
    return hardwareAccess.getSensor(2,'spi');
};

