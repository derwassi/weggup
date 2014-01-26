/**
 * Created by wassi on 19.01.14.
 */

var temp = require('../../hardware/temperatureAccess');
var delta = 0.5;
var mongoose = require('mongoose'),
    Datalog = mongoose.model('Datalog');
var lastInner = 0, lastOuter = 0;
var timeout;
//Temperatur minütlich aufzeichnen
var poll = function(){
    timeout = setTimeout(function(){
        var l;
        var inner = temp.getInnerTemperature();
        var outer = temp.getOuterTemperature();
        if(Math.abs(lastInner-inner)>delta){
            l = new Datalog({value:inner,type:'ti'});
            l.save();
            lastInner = inner;
        }
        if(Math.abs(lastOuter-outer)>delta){
            l = new Datalog({value:outer,type:'to'});
            l.save();
            lastOuter = outer;
        }

        poll();
    },60000);
};

exports.start = function(){
    poll();
};

exports.stop = function(){
    clearTimeout(timeout);
};



