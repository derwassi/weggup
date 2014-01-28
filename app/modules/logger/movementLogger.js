
/**
 * Created by wassi on 19.01.14.
 */

var acc = require('../../hardware/acceleratorAccess');
var eventEmitter = require('../../services/eventbus').emitter;
var delta = 4;//decided after data analysis
var mainThreashold = 5;
var secondaryThreashold = 0.8;
var mongoose = require('mongoose'),
    Datalog = mongoose.model('Datalog');

var mainLast = 0, secondaryLast = 0;
var timeout;
//Temperatur minütlich aufzeichnen
var poll = function(){
    timeout = setTimeout(function(){
        var l;
        var main = acc.getMainMovement();
        var secondary = acc.getSecondaryMovement();
        var logged = false;
        if(Math.abs(main-mainLast)>delta){
            l = new Datalog({value:main,type:'m1'});
            l.save();
            mainLast = main;
            logged = true;
        }
        if(Math.abs(secondary-secondaryLast)>delta){
            l = new Datalog({value:secondary,type:'m2'});
            l.save();
            secondaryLast = secondary;
        }
        //emit event, when movement is detected from first (but not second motion sensor
        if(main>mainThreashold  && logged){
            eventEmitter.emit('movement.primary');
            console.log(new Date(),'EVENT');
        }


        poll();
    },100);
};

exports.start = function(){
    poll();
};

exports.stop = function(){
    clearTimeout(timeout);
};
