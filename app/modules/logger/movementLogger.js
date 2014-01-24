
/**
 * Created by wassi on 19.01.14.
 */

var acc = require('../../hardware/acceleratorAccess');
var eventEmitter = require('events').EventEmitter;
var delta = 0.2;
var mainThreashold = 1;
var secondaryThreashold = 0.8;

var mainLast = 0, secondaryLast = 0;
var timeout;
//Temperatur minütlich aufzeichnen
var poll = function(){
    timeout = setTimeout(function(){
        var main = acc.getMainMovement();
        var secondary = acc.getSecondaryMovement();
        if(Math.abs(main-mainLast)>delta){
            var l = new Datalog({value:main,type:'m1'});
            l.save();
            mainLast = main;
        };
        if(Math.abs(secondary-secondaryLast)>delta){
            var l = new Datalog({value:secondary,type:'m2'});
            l.save();
            secondaryLast = secondary;
        };
        //emit event, when movement is detected from first (but not second motion sensor
        if(main>mainThreashold && secondary<secondaryThreashold){
            eventEmitter.emit('movement.primary');
        }


        poll();
    },60000);
}

exports.start = function(){
    poll();
};

exports.stop = function(){
    clearTimeout(timeout);
}
