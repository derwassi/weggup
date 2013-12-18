/**
 * Created by wassi on 26.11.13.
 */



angular.module('mean.directives', [])
    .directive('gradientPicker', function () {

        var scope = null;
        var player ,playerControls= null;
        var context = null;
        var createGradientPicker = function (element, model) {

            if(typeof model.gradient === 'undefined'){
                model.gradient = [{color:'#000',position:0},{color:'#fff',position:1}];
            }
            $(element).gradientPicker({
                change: function(points, styles) {
                    model.gradient = []
                    for(var i=0;i<points.length;i++){
                        model.gradient.push(points[i]);
                    }
                    if(typeof player !='undefined'){
                        updateColor(player.slider("value"));
                    }


                },
                controlPoints: model.gradient});
            context = $('canvas',$(element))[0].getContext('2d');
            var time = 1200;//(20 minuten TODO: configurable)

            var updateColor = function(value){
                var width=$('canvas', element).width();
                var data = context.getImageData(parseInt(width*value),1, 1, 1).data;
                scope.setColorPreview([data[0],data[1],data[2]]);
            }



            var startTween = function(){
                var multiplier = $('.speed',playerControls);
                var animationTime = (1-playerState.position)*time/parseInt(multiplier.val());
                console.log(animationTime, playerState.position);

                playerState = $({position:playerState.position});//create new element, or animation won't work a second time...
                playerState.animate({position:1},{
                    duration:animationTime,
                    step:function(value){
                        //console.log(value, playerState.position);
                        playerState.position=value;
                        player.slider('value',value);
                        updateColor(value);

                    },
                    complete:function(){
                        $('.play',playerControls).removeClass('playing');
                    }
                });
                $('.play',playerControls).addClass('playing');

            }
            var endTween = function(){
                playerState.stop();
                $('.play',playerControls).removeClass('playing');
            }
            var playerState = $({
                position:0
            });
            playerControls = $('<div class="gradientplayercontrols"><a href="#" class="play">play</a><select class="speed"><option value="1">original</option><option value="2">x2</option><option value="4">x4</option><option value="8">x8</option><option value="16">x16</option></select></div>');
            $('.play',playerControls).click(function(){
                if($(this).hasClass('playing')){
                    endTween(playerState);
                }else{
                    console.log(player.slider("value"), typeof player.slider("value"));
                    if(player.slider("value") == 1){
                        player.slider("value",0);
                    }
                    playerState.position = player.slider("value");
                    console.log(playerState.position);
                    startTween();

                };
                return false;
            });
            player = $('<div class="gradientplayer"/>');

            player.slider({min:0,max:1,step:0.00001,change:function(){updateColor(player.slider('value'))}});
            $(element).prepend(player);
            $(element).prepend(playerControls);

        };

        return{
            //TODO: fetch services from attributes
            link: function ($scope, element) {
                var initialised = false;
                scope = $scope;
                $scope.$watch('alarm',function(){
                    if(!initialised && typeof $scope.alarm !== 'undefined'){
                        createGradientPicker(element, $scope.alarm);
                        initialised=true;
                    }
                });
                //TODO less strict coupling via arguments!

            }
        };
    });