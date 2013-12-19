
var io = require('socket.io').listen(3010);
var mongoose = require('mongoose');
var Hardware = mongoose.model('Hardware');
var hardwareAccess = require('./hardwareAccess');

var hardware;

var map = function(val, fl,fu,tl,tu){
    return ((tu-tl)/(fu-fl))*(val-fl)+tl;
};

exports.updateHardware = function(){
    Hardware.find().populate('user', 'name username').exec(function(err,hardwares){
        if(hardwares.length>0){
            hardware=hardwares[0];
        }
    });
};

exports.updateHardware();


io.sockets.on('connection',function(socket){
    socket.on('get',function(sensor){
        if(typeof hardware.sensors[sensor.name] != 'undefined'){

            var value=hardwareAccess.getSensor(hardware.sensors[sensor.name].pin,hardware.sensors[sensor.name].mode);//TODO: map from model!
            socket.emit('sensorvalue',value);
        }

    });
    socket.on('set',function(actuator){
        if(typeof hardware.actuators[actuator.name] != 'undefined'){
            console.log(hardware.actuators[actuator.name])
            var value=hardwareAccess.setActuator(actuator.value,hardware.actuators[actuator.name].pin,hardware.actuators[actuator.name].mode,function(v){return map(v,0,255,0,1);});//TODO: map from model!
        }
    });
});