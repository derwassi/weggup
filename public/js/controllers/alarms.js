angular.module('mean.alarms').controller('AlarmsController', ['$scope', '$routeParams', '$location', 'Global', 'Alarms','Hardware','filterFilter', 'Files', function ($scope, $routeParams, $location, Global, Alarms,Hardware, filterFilter,Files) {
    //TODO: angular service
    var socket = io.connect(window.location.protocol + '//' + window.location.hostname + ":3010");

    $scope.files = [];

    Files.query(function(f){ $scope.files = f;console.log(f);});

    $scope.global = Global;
    $scope.hardware = null;
    Hardware.query(function(hardware){
        if(hardware.length>0){
            $scope.hardware = hardware[0];
            console.log($scope.hardware);
        }
    });


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
        //TODO: über sockets, sonst zu langsam!
        if(prevColors[0]!=col[0] || prevColors[1]!=col[1] || prevColors[2]!=col[2]){
            socket.emit('set',{name:'red',value:col[0]});
            socket.emit('set',{name:'green',value:col[2]});
            socket.emit('set',{name:'blue',value:col[2]});


            prevColors = col;
        }

    };

    $scope.playAudio = function(audio){
        socket.emit('play',audio);
    };
    $scope.stopAudio = function(audio){
        socket.emit('stop',audio);
    };

    $scope.playAudioPreview = function(files){
        socket.emit('playPreview',files);
    };
    $scope.stopAudioPreview = function(files){
        socket.emit('stopPreview',files);
    };




    $scope.find = function() {
        console.log('find');
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

    }
}]);