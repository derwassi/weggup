
var _ = require('underscore'),
    piblaster = require('pi-blaster.js'),
    spi = require('mcp3008'),
    adc = new Mcp3008(),
    channel = 0;
//TODO: aus model lesen, welche channels es gibt
var values = [0,0,0,0,0];
adc.poll(0,1000,function(value){values[0] = value;});
adc.poll(1,1000,function(value){values[1] = value;});
adc.poll(2,1000,function(value){values[2] = value;});
adc.poll(3,1000,function(value){values[3] = value;});
adc.poll(4,1000,function(value){values[4] = value;});

exports.getSensor = function(pin,mode,map){
    if(typeof map == 'undefined') {
        map = function(v){return v;};
    }
    var value = 0;
    if(mode=='spi'){
        //TODO: readSpiValue
        value = values[pin];
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
            console.log('error reading pin ' + pin + ' (' + mode + ')');
            return false;
        }
    }
    return true;
};

