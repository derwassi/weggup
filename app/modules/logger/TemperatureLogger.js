/**
 * Created by wassi on 19.01.14.
 */

var temp = require('../../hardware/temperatureAccess');
var delta = 0.5;

var lastInner = 0, lastOuter = 0;
var timeout;
//Temperatur minütlich aufzeichnen
var poll = function(){
    timeout = setTimeout(function(){
        var inner = temp.getInnerTemperature();
        var outer = temp.getOuterTemperature();
        if(Math.abs(lastInner-inner)>delta){
            //TODO: add to model;
            lastInner = inner;
        };
        if(Math.abs(lastOuter-outer)>delta){
            //TODO: add to model;
            lastOuter = outer;
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



