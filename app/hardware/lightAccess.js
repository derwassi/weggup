/**
 * Created by wassi on 19.01.14.
 */


    var hardwareAccess = require('./hardwareAccess');

var temperatureAccess = require('./temperatureAccess');
var hardware = require('../models/hardware');

var fan = hardware.actuators.fan;
var red = hardware.actuators.red;
var green = hardware.actuators.green;
var blue = hardware.actuators.blue;

var multiplier = 1;

//linear fading table, found on the interwebs
var table =[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,
3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,5,5,5,
5,5,5,5,5,6,6,6,6,6,6,6,7,7,7,7,7,7,8,8,8,8,8,8,9,9,
9,9,10,10,10,10,10,11,11,11,11,12,12,12,13,13,13,13,
14,14,14,15,15,15,16,16,16,17,17,18,18,18,19,19,20,
20,20,21,21,22,22,23,23,24,24,25,26,26,27,27,28,29,
29,30,31,31,32,33,33,34,35,36,36,37,38,39,40,41,42,
42,43,44,45,46,47,48,50,51,52,53,54,55,57,58,59,60,
62,63,64,66,67,69,70,72,74,75,77,79,80,82,84,86,88,
90,91,94,96,98,100,102,104,107,109,111,114,116,119,
122,124,127,130,133,136,139,142,145,148,151,155,158,
161,165,169,172,176,180,184,188,192,196,201,205,210,
214,219,224,229,234,239,244,250,255];

var map=function(v){
    v=parseInt(v);
    v=Math.min(255,v);
    v=Math.max(0,v);
    v = table[parseInt(v)];
    v /= 255;//map to 0-1

    return v*multiplier;
};

//prevent overheating
var overheatCheck = function(){
    var t =temperatureAccess.getInnerTemperature();
    var oldMultiplier = multiplier;
    if(t>40){
        multiplier = 0;
    }else if(t>33){
        multiplier = 0.5;
    }else if(t>27){
        multiplier = 0.99;
    }else{
        multiplier = 1;
    }


    if(multiplier!=oldMultiplier){
        exports.setColor(lastColor.r,lastColor.g,lastColor.b);
        hardwareAccess.setActuator(1, fan.pin, fan.type, function (){return multiplier<1?1:0;});
    }


};

setInterval(overheatCheck,1000);


var lastColor={r:0,g:0,b:0};

exports.setColor = function (r,g,b) {
    //console.log(r,g,b);
    //console.log('test',model);
    lastColor={r:r,g:g,b:b};
    hardwareAccess.setActuator(r, red.pin, red.type, map);
    hardwareAccess.setActuator(g, green.pin, green.type, map);
    hardwareAccess.setActuator(b, blue.pin, blue.type, map);
};

