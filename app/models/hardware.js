/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


//obsolete, makes no sense inmodel, but useful for reference


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
                default:22
            }
        },
        green: {
            mode:{
                type:String,
                default: 'pwm'
            },
            pin:{
                type:String,
                default:23
            }

        },
        blue: {
            mode:{
                type:String,
                default: 'pwm'
            },
            pin:{
                type:String,
                default:24
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
            }

        }

    }

});


/**
 * Statics
 */
HardwareSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Hardware', HardwareSchema);
