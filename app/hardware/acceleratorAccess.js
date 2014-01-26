/**
 * Created by wassi on 19.01.14.
 */
/**
 * Created by wassi on 19.01.14.
 */

//innerer schmeisst event bei Überhitzung und abkühlung (einschalten/ausschalten von licht!)

var hardwareAccess = require('./hardwareAccess');

//from +100 to -100, (chosen arbitrarily)
var map = function(v){
    return (v-(512))/5.12;
}

exports.getMainMovement = function(){
    //TODO: aus Modell lesen
    return hardwareAccess.getSensor(0,'spi',map);
};

exports.getSecondaryMovement = function(){
    //TODO: aus Modell lesen
   return hardwareAccess.getSensor(1,'spi',map);
};