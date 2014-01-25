/**
 * Created by wassi on 19.01.14.
 */
/**
 * Created by wassi on 19.01.14.
 */

//TODO: zwei sensoren,
//innerer schmeisst event bei Überhitzung und abkühlung (einschalten/ausschalten von licht!)

var hardwareAccess = require('./hardwareAccess');

//

exports.getMainMovement = function(){
    //TODO: aus Modell lesen
    return hardwareAccess.getSensor(3,'spi');
};

exports.getSecondaryMovement = function(){
    //TODO: aus Modell lesen
   return hardwareAccess.getSensor(4,'spi');
};