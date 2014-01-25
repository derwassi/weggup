/**
 * Created by wassi on 25.01.14.
 */

var mongoose = require('mongoose');
Setting = mongoose.model('Settings');

var checkInsertAndUpdateValue = function (id, key, value, callback) {
    Setting.findOne({module: id, name: key}, function (err, setting) {
        if (!setting) {
            //insert when not available
            new Setting({module: id, name: key, value: ''+value, type: typeof value}).save(function () {
            });
        } else {
            //update type if necessary
            if (setting.type != typeof value) {
                setting.type = typeof value;
                Setting.save(setting, function () {
                });
            }
        }
    });
};

var convertValue = function(setting,callback){
    if (setting) {

        if (setting.type === 'number') {
            callback(parseFloat(setting.value));
        } else if (setting.type === 'Date') {
            callback(Date.parse(setting.value));
        } else {
            callback(setting.value);
        }
    }

};
var saveValue = function (id, key, value, callback) {
    Setting.findOne({module: id, name: key}, function (err, setting) {
       if (setting) {
            setting.value = value;

            setting.save(function (err,setting) {
                convertValue(setting,callback);
            });
        }
    });
};

var loadValue = function (id, key, callback) {
    Setting.findOne({module: id, name: key}, function (err, setting) {
       convertValue(setting,callback);
    });
};

exports.init = function (settings, id) {
    Object.keys(settings).forEach(function (key) {
        var val = settings[key];
        checkInsertAndUpdateValue(id, key, val);
        loadValue(id, key, function (val) {

            settings[key] = val;
        });
    });
};

exports.save = function (newSettings, id,settings) {
    //console.log('SPEICHERN',settings);
    Object.keys(newSettings).forEach(function (key) {
        var val = newSettings[key];

        saveValue(id, key, val,function(val){

            settings[key]=val;

        });
    });
};

exports.load = function (settings, id) {
    Object.keys(settings).forEach(function (key) {

        loadValue(id, key, function (val) {
            settings[key] = val;
        });
    });
};
