/**
 * Created by wassi on 19.01.14.
 */

exports.getEditor = function(module,url){
    return function(req,res,next){

        module.setSettings(req.query);
        res.send(200);
    };
};

exports.getShower = function(module,url){
    return function(req,res,next){
        res.jsonp(module.getSettings());
    };
};
