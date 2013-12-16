//Articles service used for articles REST endpoint
angular.module('mean.alarms').factory("Alarms", ['$resource', function($resource) {
    return $resource('alarms/:alarmId', {
        alarmId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);