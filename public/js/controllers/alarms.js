angular.module('mean.alarms').controller('AlarmsController', ['$scope', '$routeParams', '$location', 'Global', 'Alarms','filterFilter', function ($scope, $routeParams, $location, Global, Alarms, filterFilter) {
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
}]);