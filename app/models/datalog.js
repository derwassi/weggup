/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;





/**
 * Article Schema
 */
var DatalogSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    value:{
       type:Number,
       default:0
    },
    type:{
        type:String,
        default:''
    },
    aggregation:{
        type:Number,
        default:0
    }


});


/**
 * Statics
 */
HardwareSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })

};

mongoose.model('Datalog', DatalogSchema);
