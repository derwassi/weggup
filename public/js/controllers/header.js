angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Alarms",
        "link": "alarms"
    }, {
        "title": "Create new Alarm",
        "link": "alarms/create"
    },{
        "title": "Charts",
        "link": "logs"
    }];
    
    $scope.isCollapsed = false;
}]);