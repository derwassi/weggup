angular.module('mean.alarms').controller('AlarmsController', ['$scope', '$routeParams', '$location', 'Global', 'Alarms','Hardware','filterFilter', 'Files', function ($scope, $routeParams, $location, Global, Alarms,Hardware, filterFilter,Files) {

    $scope.from = new Date(new Date().getTime()-86400*1000);
    $scope.to = new Date();
    $scope.logs = [{id:'l',selected:false, name:'Brightness', data:null, color:0},
        {id:'m1',selected:false, name:'Movement (primary)',data:null, color:1},
        {id:'m2',selected:false, name:'Movement (secondary)',data:null, color:2},
        {id:'ti',selected:false, name:'Temperature (inner)',data:null, color:3},
        {id:'to',selected:false, name:'Temperature (outer)',data:null, color:4}
    ];
    $scope.data = [];

    $scope.chartConfig = {xaxis: {
        mode: "time"},
        series:{
            lines:{
                show:true,
                steps:true
            }
        }
    }

    var processData = function(data){
        var d = [];
        for(var i=0;i<data.length;i++){
            d.push([Date.parse(data[i].created),data[i].value]);
        }
        return d;
    };
    var updateLog = function(log,from,to,callback){
        Logs.get({
            type: log.id,
            from:from,
            to: to
        }, function(alarm) {
            log.data = processData(data);
            callback(log);
        });
    };

    var setGraphs = function(){
        $scope.data = [];
        angular.each($scope.logs,function(v){
            if(log.selected){
                data.push({label:log.name,data:log.data, color:log.color});
            }
        });
    };

    $scope.changeDate = function(){
        angular.forEach($scope.logs,function(v){
            updateLog(v,$scope.from,$scope.to,setGraphs);
        });
    }

    $scope.change = function(log){
        if(log.selected && log.data==null){
           updateLog(log,$scope.from, $scope.to,setGraphs);
        }
        setGraphs();

    };


}]);