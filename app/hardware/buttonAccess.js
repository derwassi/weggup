/**
 * Created by wassi on 19.01.14.
 */

var onoff = require('onoff').Gpio;

var sharedResource = require('../services/sharedResources');
var light = require('../modules/light/light');
//TODO: werte aus konfig
var button1 = new onoff.Gpio(18, 'in', 'both');

//stop running services, when pressing button.
//when no process was running, start light.
//TODO: manage via configuration, what to launch!
button1.watch(function(err, value) {
    var stopped = false;
    var proc;
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

});