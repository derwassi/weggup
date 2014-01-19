/**
 * Created by wassi on 26.12.13.
 */

var _ = require('underscore');
var soundAccess = require('./../../hardware/soundAccess');


var timeOuts = new Array();
var instances = new Array();


var convertTimeToMillis = function(time){
    var t = time.split(':');
    return ((parseInt(t[0])*60+parseInt(t[1]))*1000);
}

var list = [];
var length = 1;
var start = 0;

var play = function(){
    if(!start) start='0:0';
    start = convertTimeToMillis(start)-100;//-100 ms  to ensure start of first sound!
    exports.stop();
    console.log(list);
    if(!list){
        list = new Array();
    }
    list.forEach(function(v){

        if(!v.from){v.from='0:0';}
        if(!v.to){v.to = '0:0';}
        var from = convertTimeToMillis(v.from);
        var to = convertTimeToMillis(v.to);
        if(to>start){
            to=to-start;
            from = Math.max(from-start,0);
            console.log(to,from);
            var player = soundAccess.play('./moodsounds/' + v.file, v.repeat, v.volume);
            instances.push(player);
            timeOuts.push(setTimeout(function(){
                console.log('start',v.file);
                player.play();
            },from));
            timeOuts.push(setTimeout(function(){
                console.log('stop', v.file);
                player.stop();
            },to));
        }
    })

}



var running = false;
//access restriction for light
var soundControl = {
    start: function(){
       play();
        running = true;
    },
    stop: function(){
        timeOuts.forEach(function(v){
            clearTimeout(v);
        });
        timeOuts = new Array();
        instances.forEach(function(v){
            v.stop();
        });
        instances = new Array();
        running = false;
    },
    isProcessRunning: function(){
        return running;
    }
};


exports.play = function (p, l) {
    sharedResources.sound.run(lightControl);
};

exports.stop = function () {
    soundControl.stop();
};


exports.setParams = function(li,le,st){
    list = li;
    length = le;
    start = st;
}