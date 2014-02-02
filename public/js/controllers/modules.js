angular.module('mean.modules').controller('ModulesController', ['$resource', '$scope', '$routeParams', '$location'/*, 'Global'*/, function ($resource, $scope, $routeParams, $location/*, Global*/) {

    $scope.modules = [
        {id: 'sound/vorleserModule', title: 'Vorlesen'},
        {id: 'light/lightModule', title: 'Light'},
        {id: 'light/moodLightModule', title: 'Moodlight'}/*,
        {id: 'soundAndLight/alarmModule'},
        {id: 'sound/soundMixerModule', title: 'soundMixer'},
        {id: 'light/sequenceLightModule', title: 'sequenceLightModule'}*/
    ];

    $scope.settings = {};
    var getActiveModule = function () {
        var cur = null;
        $scope.modules.forEach(function (v) {

            if (v.id === $routeParams.module) {

                cur = v;
            }
        });
        return cur;
    };

    $scope.$watch('activeModule', function (newVal) {
        //TODO:load settings
        console.log(newVal);
    });


    $scope.start = function (module) {
        $resource('module/' + module.id + '/start').get(function () {
            $scope.modules.forEach(function (v) {
                v.running = v.id === module.id;
            });
        });


    };

    $scope.stop = function (module) {
        $resource('module/' + module.id + '/stop').get(function () {
            module.running = false;
        });


    };

    $scope.save = function () {

        $resource('module/' + $scope.activeModule.id, {}, {'put': {method: 'PUT', params: $scope.settings}}).put(
            function () {
                $location.path('/module');
            }
        );


    };

    $scope.activeModule = getActiveModule();
    if ($scope.activeModule) {
        var settings = $resource('module/' + $scope.activeModule.id).get(function () {
            console.log(settings);
            $scope.settings = settings;
        });
    }


}]);