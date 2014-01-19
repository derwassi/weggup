/**
 * Created by wassi on 19.01.14.
 */

var light = require('../../hardware/brightnessAccess');
var delta = 0.5;

var last = 0, lastOuter = 0;
var timeout;
//Temperatur minütlich aufzeichnen
var poll = function(){
    timeout = setTimeout(function(){
        var current = light.getAmbientBrightness();
        if(Math.abs(last-current)>delta){
            //TODO: add to model;
            last = current;
        };

        poll();
    },60000);
}

exports.start = function(){
    poll();
};

exports.stop = function(){
    clearTimeout(timeout);
}



