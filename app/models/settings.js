/**
 * Created by wassi on 25.01.14.
 */

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;





/**
 * Article Schema
 */
var SettingsSchema = new Schema({
    value:{
        type:String,
        default:''
    },
    module:{
        type:String,
        default:''
    },
    type:{
       type:String,
       default:'String'
    },
    name:{
        type:String,
        default:''
    }


});



mongoose.model('Settings', SettingsSchema);
