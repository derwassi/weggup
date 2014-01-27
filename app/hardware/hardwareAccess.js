
var _ = require('underscore'),
    piblaster = require('pi-blaster.js'),
    spi = require('mcp3008.js');
    try{
        var adc = new spi();
    }catch(e){
        var f=function(timeout,callback){

           setTimeout(function(){f(timeout,callback);},timeout);
            callback(-1);
        };
        adc = {
            poll:function(idx,interval,callback){
            f(interval,callback);

        }};
    }
    var channel = 0;
//TODO: aus model lesen, welche channels es gibt
var values = [0,0,0,0,0,0,0,0,0];

var avg = [0,0,0,0,0,0,0,0,0,0,0];
var diff= [0,0,0,0,0,0,0,0,0,0,0];
var num = 10;
var sum = 0;
var cnt = 0;
var avg2 = [0,0,0,0,0,0,0,0,0,0,0];
var cnt2 = 0;
var sum2 = 0;
var diff2 = [0,0,0,0,0,0,0,0,0,0,0];
//TODO: issue from other access classes
adc.poll(0,10,function(value){
    sum-= diff[cnt];

    var d = Math.abs(avg[cnt]-avg[(cnt+num-1)%num]);
    diff[cnt] = d;
    sum+=diff[cnt];
    cnt = (cnt+1)%num;
    values[0] = sum/num;
});
adc.poll(1,10,function(value){
    sum2-= diff2[cnt2];
    var d = Math.abs(avg2[cnt2]-avg2[(cnt2+num-1)%num]);
    diff2[cnt2] = d;
    sum2+=diff2[cnt2];
    cnt2 = (cnt2+1)%num;
    values[1] = sum2/num;
});
adc.poll(2,1000,function(value){values[2] = value;});
adc.poll(3,1000,function(value){values[3] = value;});
adc.poll(4,1000,function(value){values[4] = value;});

exports.getSensor = function(pin,mode,map){
    if(typeof map == 'undefined') {
        map = function(v){return v;};
    }
    var value = 0;
    if(mode=='spi'){
        //TODO: readSpiValue
        value = values[pin];
    }
    value = map(value);

    return value;
};

exports.setActuator = function(value, pin, mode, map){
    if(typeof map == 'undefined') {
        map = function(v){return v;};
    }
    //console.log(value,pin,mode);
    if(mode == 'pwm'){
        try{
            //console.log('set actuator ' + pin + ' to ' + map(value));
            //piblaster.setPwm(pin,map(value));
        }catch(exception){
            console.log('error reading pin ' + pin + ' (' + mode + ')', exception);
            return false;
        }
    }
    return true;
};


