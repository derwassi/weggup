/**
 * Created by wassi on 19.01.14.
 */

var light = require('../hardware/brightnessAccess');
var delta = 2;
var mongoose = require('mongoose'),
    Datalog = mongoose.model('Datalog');
var last = 0;
var timeout;
//Temperatur minütlich aufzeichnen
var poll = function(){
    timeout = setTimeout(function(){

        var current = light.getAmbientBrightness();
        if(Math.abs(last-current)>delta){
            var l = new Datalog({value:current,type:'l'});
            l.save();
            last = current;
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



