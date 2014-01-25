/**
 * Created by wassi on 19.01.14.
 */
exports.getLauncher = function(module,url){

    return function(req,res,next){
        module.launch();
        res.send(url);
    };
};

exports.getStopper = function(module,url){

    return function(req,res,next){
        module.stop();
        res.send(url);
    }
};