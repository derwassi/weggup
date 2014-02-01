/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var AlarmSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    },
    active:{
        type:Boolean,
        default: true
    },
    title:{
        type: String,
        trim:true
    },
    oneTime:{
        type:Boolean,
        default:true
    },
    wakeTime: {//light alarm finishes at this time
        type: String,
        default:Date.now


    },

    dayOfWeek: {
        type: Array,
        default: []

    },


    gradient:{
        type:Array,
        default: [{color:'#000',position:0},{color:'#fff',position:1}]
    },

    ambientSounds:{
        type:Array,
        default: []
    },
    ambientDuration:{
        type:String,
        default:'30:00'
    },
    allowedPriorTime:{
        type:String,
        default:'00:30'
    }


});

/**
 * Validations
 */
AlarmSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

AlarmSchema.pre('save', function(next) {
    this.modified=Date.now();
    next();
});

/**
 * Statics
 */
AlarmSchema.statics.load = function(id, cb) {

    this.findOne({
        _id: id
    }).exec(cb);

};

mongoose.model('Alarm', AlarmSchema);
