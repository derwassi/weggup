angular.module('mean.alarms').controller('AlarmsController', ['$scope', '$routeParams', '$location', 'Global', 'Alarms','filterFilter', 'Files', function ($scope, $routeParams, $location, Global, Alarms, filterFilter,Files) {
    //TODO: angular service
    var socket = io.connect(window.location.protocol + '//' + window.location.hostname + ":3010");

    $scope.files = [];

    Files.query(function(f){ $scope.files = f;});

    $scope.global = Global;

    $scope.days = [
        { name: 'Monday', value:0,   selected: false },
        { name: 'Tuesday', value:1,   selected: false },
        { name: 'Wednesday', value:2,   selected: false },
        { name: 'Thursday', value:3,   selected: false },
        { name: 'Friday', value:4,   selected: false },
        { name: 'Saturday', value:5,   selected: false },
        { name: 'Sunday', value:6,   selected: false }
    ];

    $scope.selectedDays = function() {
        return filterFilter($scope.days, { selected: true });
    };
    // selected fruits
    $scope.selection = [];


    $scope.$watch('days|filter:{selected:true}', function (nv) {
        $scope.selection = nv.map(function (alarm) {
            return alarm.value;
        });

    }, true);

    $scope.create = function() {
        var alarm = new Alarms({
            title: this.title,
            wakeTime: this.wakeTime,
            dayOfWeek: $scope.selection
        });

        alarm.$save(function(response) {

            $location.path("alarms/" + response._id);
        });

        this.title = "";
        this.wakeTime = '00:00';
        this.dayOfWeek = [];
    };

    $scope.remove = function(alarm) {
        if (alarm) {
            alarm.$remove();

            for (var i in $scope.alarms) {
                if ($scope.alarms[i] == alarm) {
                    $scope.alarms.splice(i, 1);
                }
            }
        }
        else {
            $scope.alarm.$remove();
            $location.path('alarms');
        }
    };

    $scope.update = function(alarm,updateDays) {
        if (!alarm.updated) {
            alarm.updated = [];
        }

        if(updateDays){
            alarm.dayOfWeek = $scope.selection;
        }
        alarm.updated.push(new Date().getTime());

        alarm.$update(function() {
            $location.path('alarms/');
        });
    };


    var prevColors = [-1,-1,-1];
    $scope.setColorPreview = function(col){

        if(prevColors[0]!=col[0] || prevColors[1]!=col[1] || prevColors[2]!=col[2]){
            console.log(col);
            socket.emit('setColor',{r:col[0],g:col[1],b:col[2]});
            prevColors = col;
        }
    };

    /*$scope.playColorPreview = function(files){
        socket.emit('playColorPreview',files);
    };*/


    $scope.playAudio = function(audio){

        socket.emit('playAudio',{file:'./moodsounds/'+audio.file,volume:audio.volume});
    };
    $scope.stopAudio = function(audio){
        socket.emit('stopAudio',audio);
    };

    $scope.play = function(){
        var d = {audio:{list:[]},light:{}};
        $scope.alarm.ambientSounds.forEach(function(v,k){

            d.audio.list.push({file:'./moodsounds/'+ v.file,
                from: v.from,
            to: v.to,
            repeat: v.repeat,
            volume: v.volume}) ;
        });
        d.light={list:$scope.alarm.gradient};
        d.duration = $scope.alarm.ambientDuration;
        d.speed=$scope.speed;
        console.log(d);
        socket.emit('play',d);
    };
    $scope.stop = function(){
        socket.emit('stop');
    };




    $scope.find = function() {
        Alarms.query(function(alarms) {
            $scope.alarms = alarms;
        });
    };

    $scope.findOne = function() {

        Alarms.get({
            alarmId: $routeParams.alarmId
        }, function(alarm) {
            $scope.alarm = alarm;

            angular.forEach(alarm.dayOfWeek,function(el){
                $scope.days[el].selected=true;
            });
        });
    };
    $scope.loadSoundlist = function(){

    };
}]);