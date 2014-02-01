/**
 * Created by wassi on 19.01.14.
 */

//TODO: put all this somewhere else...
var onoff = require('onoff').Gpio;
var hardware = require('../models/hardware');
var sharedResource = require('../services/sharedResources');
var light = require('../modules/light/lightModule');
var pin = hardware.sensors.button;




try{
var button1 = new onoff(pin.pin, 'in', 'both');

//stop running services, when pressing button.
//when no process was running, start light.
//TODO: manage via configuration, what to launch!
button1.watch(function(err, value) {
    var proc;
    var stopped = false;
    if(value==1){
    if(sharedResource.light.isProcessRunning()){
        proc = sharedResource.light.getCurrentProcess();
        if(proc) proc.stop();
        stopped = true;
    }
    if(sharedResource.sound.isProcessRunning()){
        proc = sharedResource.sound.getCurrentProcess();
        if(proc) proc.stop();
        stopped = true;
    }
    if(!stopped){
        light.start();
    }
}

});
}catch(e){
    console.log('no buttons');
}