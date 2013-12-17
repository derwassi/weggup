/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


var map = function(vhal, fl,fu,tl,tu){
    return ((tu-tl)/(fu-fl))*(val-fl)+tl;
};
var setNotAllowed=function(val,schematype, name, model){
    throw new Exception('setter not allowed for ' + name + '!');
};

var getSensorValue = function(val,schematype,name, model){
    if(model.sensors[name].mode == 'spi'){
        return getSpiSensorValue(model.sensors[name].pin,
            function(v){return map(v,schematype.map.fromLower,schematype.map.fromUpper,schematype.map.toLower, schematype.map.toUpper);});
    }else{
        throw new Exception('unknown connection method (' + model.sensors[name].mode + ') for sensor ' + name);
    }
};

var setActuator = function(val,schematype,name, model){
    if(model.actuators[name].mode == 'pwm'){
       setPwmActuator(model.actuators[name].pin,
            function(v){return map(v,schematype.map.fromLower,schematype.map.fromUpper,schematype.map.toLower, schematype.map.toUpper);});
    }else{
        throw new Exception('unknown connection method (' + model.actuators[name].mode + ') for actuator ' + name);
    }
};


var setPwmActuator = function(pin,value, map){
    //TODO: implement
    console.log('set actuator ' + pin + ' to ' + map(value) + ' (' + value + ')');
};

var getSpiSensorValue = function(pin,map){
    //TODO: implement
    console.log('read sensorvalue from pin ' + pin);
    var value = Math.rand(0,1024);
    return map(value);
};


/**
 * Article Schema
 */
var HardwareSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    },


    actuators:{
        red: {
            mode:{
                type:String,
                default: 'pwm'
            },
            pin:{
                type:String,
                default:4
            },
            value:{
                type:String,
                default:0,
                map:{fromLower:0, fromUpper:255, toLower:0,toUpper:1},
                set: function(val,schematype){setActuator(val,schematype, 'red',this);}

            }

        },
        green: {
            mode:{
                type:String,
                default: 'pwm'
            },
            pin:{
                type:String,
                default:5
            },
            value:{
                type:String,
                default:0,
                map:{fromLower:0, fromUpper:255, toLower:0,toUpper:1},
                set: function(val,schematype){setActuator(val,schematype, 'green',this);}

            }

        },
        blue: {
            mode:{
                type:String,
                default: 'pwm'
            },
            pin:{
                type:String,
                default:6
            },
            value:{
                type:String,
                default:0,
                map:{fromLower:0, fromUpper:255, toLower:0,toUpper:1},
                set: function(val,schematype){setActuator(val,schematype, 'blue',this);}

            }

        }
    },
    sensors: {
        //use only z-axis for accelerometer. Enough for motion detection
        accelerometer:{
            mode:{
                type:String,
                default: 'spi'
            },
            pin:{
                type:String,
                default:0
            },
            value:{
                type:String,
                default:0,
                map:{fromLower:0, fromUpper:1023, toLower:-2,toUpper:2},
                set: function(val,schematype){setNotAllowed(val,schematype, 'accelerometer',this);},
                get: function(val,schematype){getSensorValue(val,schematype,'accelerometer',this);}
            }
        },
        secondaryAccelerometer:{
            mode:{
                type:String,
                default: 'spi'
            },
            pin:{
                type:String,
                default:1
            },
            value:{
                type:String,
                default:0,
                map:{fromLower:0, fromUpper:1023, toLower:-2,toUpper:2},
                set: function(val,schematype){setNotAllowed(val,schematype, 'secondaryAccelerometer',this);},
                get: function(val,schematype){getSensorValue(val,schematype,'secondaryAccelerometer',this);}

            }
        },
        ambientLight:{
            mode:{
                type:String,
                default: 'spi'
            },
            pin:{
                type:String,
                default:2
            },
            value:{
                type:String,
                default:0,
                map:{fromLower:0, fromUpper:1023, toLower:-2,toUpper:2},
                set: function(val,schematype){setNotAllowed(val,schematype, 'ambientLight',this);},
                get: function(val,schematype){getSensorValue(val,schematype,'ambientLight',this);}

            }
        },
        ambientTemperature:{
            mode:{
                type:String,
                default: 'spi'
            },
            pin:{
                type:String,
                default:3
            },
            value:{
                type:String,
                default:0,
                map:{fromLower:0, fromUpper:1023, toLower:-2,toUpper:2},
                set: function(val,schematype){setNotAllowed(val,schematype, 'ambientTemperature',this);},
                get: function(val,schematype){getSensorValue(val,schematype,'ambientTemperature',this);}

            }
        },
        innerTemperature:{
            mode:{
                type:String,
                default: 'spi'
            },
            pin:{
                type:String,
                default:4
            },
            value:{
                type:String,
                default:0,
                map:{fromLower:0, fromUpper:1023, toLower:-2,toUpper:2},
                set: function(val,schematype){setNotAllowed(val,schematype, 'innerTemperature',this);},
                get: function(val,schematype){getSensorValue(val,schematype,'innerTemperature',this);}

            }

        }

    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});


/**
 * Statics
 */
HardwareSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('owner', 'name username').exec(cb);
};

mongoose.model('Hardware', HardwareSchema);
