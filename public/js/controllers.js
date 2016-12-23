angular.module('GMPDApp', [])
    .controller('SearchController', function($scope, $http) {
        $scope.search = function() {
            console.log($scope.query);
            if ($scope.query) {
                $http({
                    method: 'GET',
                    url: '/search?q=' + encodeURIComponent($scope.query)
                }).then(function successCallback(res) {
                    $scope.tracks = res.data.entries.filter((x) => x.type == 1).map((x) => x.track);
                    $scope.artists = res.data.entries.filter((x) => x.type == 2).map((x) => x.artist);
                    console.log($scope.tracks);
                }, function errorCallback(res) {
                    console.log(res);
                });
            }
        }
        $scope.search();
    })
