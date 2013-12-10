h/**
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
    wakeTime: {
        type: Date,
        default: function(){return Date.now()+600;}

    },
    dayOfWeek: {
        type: Array,
        default: []

    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
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
    next()
});

/**
 * Statics
 */
ArticleSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Article', ArticleSchema);
