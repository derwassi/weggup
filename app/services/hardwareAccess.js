
var _ = require('underscore'),
    piblaster = require('pi-blaster.js');



exports.getSensor = function(pin,mode,map){
    if(typeof map == 'undefined') {
        map = function(v){return v;};
    }
    var value = 0;
    if(mode=='spi'){
        //TODO: readSpiValue
        value = Math.random();
    }
    value = map(value);
    return value;
};

exports.setActuator = function(value, pin, mode, map){
    if(typeof map == 'undefined') {
        map = function(v){return v;};
    }
    //console.log(value,pin,mode);
    if(mode == 'pwm'){
        try{
            //console.log('set actuator ' + pin + ' to ' + map(value));
            piblaster.setPwm(pin,map(value));
        }catch(exception){
            console.log(exception);
            return false;
        }
    }
    return true;
};


