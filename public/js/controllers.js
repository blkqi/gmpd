angular.module('GMPDApp', [])
    .controller('SearchController', function($scope, $http) {
        $http({
            method: 'GET',
            url: '/search?q=carl+craig'
        }).then(function successCallback(res) {
            $scope.tracks = res.data.entries.filter((x) => x.type == 1).map((x) => x.track);
            $scope.artists = res.data.entries.filter((x) => x.type == 2).map((x) => x.artist);
        }, function errorCallback(res) {
            console.log(res);
        });
    })

