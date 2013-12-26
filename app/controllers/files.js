/**
 * Module dependencies.
 */
var _ = require('underscore');
var fs = require('fs');


/**
 * List of files
 */
exports.all = function(req, res) {
    //TODO: in model auslagern!
    fs.readdir('./moodsounds',function(err,files){
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            console.log(files);
            var f = []
            for(file in files){
                f.push({file:files[file]});
            }

            res.jsonp(f);
        }
    });

};
