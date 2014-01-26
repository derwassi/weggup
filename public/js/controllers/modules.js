angular.module('mean.modules').controller('ModulesController', ['$resource', '$scope', '$routeParams', '$location', 'Global', function ($resource, $scope, $routeParams, $location, Global) {

    $scope.modules = [
        {id: 'sound/vorleser', title: 'Vorlesen'},
        {id: 'light/light', title: 'Light'},
        {id: 'light/moodLight', title: 'Moodlight'}
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

    $scope.$watch('activeModule', function (newVal, oldVal) {
        //TODO:load settings
        console.log(newVal);
    });


    $scope.start = function (module) {
        var res = $resource('module/' + module.id + '/start').get(function () {
            $scope.modules.forEach(function (v) {
                v.running = v.id === module.id;
            });
        });


    };

    $scope.stop = function (module) {
        var res = $resource('module/' + module.id + '/stop').get(function () {
            module.running = false;
        });


    };

    $scope.save = function () {

        var res = $resource('module/' + activeModule.id, {}, {'put': {method: 'PUT', params: $scope.settings}}).put(
            function () {
                $location.path('/module');
            }
        );


    };

    var activeModule = getActiveModule();
    if (activeModule) {
        var settings = $resource('module/' + activeModule.id).get(function () {
            console.log(settings);
            $scope.settings = settings;
        });
    }


}]);