/**
 * Created by wassi on 01.02.14.
 */

glob = require('glob');
var should;
should = require('should');
/*globals Player:false, Song: false*/

describe("Modules ", function() {
    var modules = [];

    before(function(done) {
        var app= require('../../server');
        glob("./app/modules/**/*.js", {}, function (er, files) {
            if(er ) throw er;
            modules = files;
            done();
        });

    });

    it('There should be modules',function(){
       modules.length.should.not.equal(0);
    });

   it('Each module should implement the module interface:',function(){

        for(var i=0;i<modules.length;i++){
            var module = modules[i];
                var m = require('../../' + module);
                m.should.have.properties(['launch','stop','setSettings','getSettings','getIdentifier']);
                /*m.getIdentifier.should.be.a.Function;
                m.launch.should.be.a.Function;
                m.stop.should.be.a.Function;
                m.setSettings.should.be.a.Function;
                m.getSettings.should.be.a.Function;*/


        }


    });



});
