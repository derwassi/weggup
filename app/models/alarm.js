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
    title:{
        type: String,
        trim:true
    },
    oneTime:{
        type:Boolean,
        default:true
    },
    wakeTime: {
        type: String,
        default:Date.now


    },
    snoozeTime: {
        type: String,
        default:'00:05'


    },
    dayOfWeek: {
        type: Array,
        default: []

    },
    useLight:{
      type:Boolean,
        default:true
    },
    gradient:{
        type:Array,
        default: [{color:'#000',position:0},{color:'#fff',position:1}]
    },
    useAmbientSound:{
      type:Boolean,
        default:true
    },
    ambientSounds:{
        type:Array,
        default: []
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
    })
    ;
};

mongoose.model('Alarm', AlarmSchema);
