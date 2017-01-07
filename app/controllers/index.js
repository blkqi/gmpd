angular
    .module('app', [require('angular-aria'), require('angular-animate'), require('angular-material')])
    .controller('SearchController', SearchController);
    
function SearchController($scope, $http, $location, $mdToast) {
    $scope.menuItems = [
        {name: 'Play track', mode: 'play', type: 'track', id: 'storeId', icon: 'play_arrow'},
        {name: 'Add track',  mode: 'add',  type: 'track', id: 'storeId', icon: 'add'},
        {name: 'Play album', mode: 'play', type: 'album', id: 'albumId', icon: 'playlist_play'},
        {name: 'Add album',  mode: 'add',  type: 'album', id: 'albumId', icon: 'playlist_add'},
        {name: 'Play radio', mode: 'play', type: 'radio', id: 'storeId', icon: 'radio'},
    ];

    $scope.search = function() {
        if ($scope.query) {
            $http({
                method: 'GET',
                url: '/search?q=' + encodeURIComponent($scope.query)
            }).then(function successCallback(res) {
                $scope.entries = res.data.entries;
                $location.search({ q: $scope.query });
            }, function errorCallback(res) {
                console.log(res);
            });
        }
    }

    $scope.artist = function(id) {
        $http({
            method: 'GET',
            url: '/artist?id=' + encodeURIComponent(id)
        }).then(function successCallback(res) {
            $scope.entries = res.data.topTracks.map(function(x) {return {track:x,type:'1'}});
            $location.search({ artist: id });
        }, function errorCallback(res) {
            console.log(res);
        });
    }

    $scope.album = function(id) {
        $http({
            method: 'GET',
            url: '/album?id=' + encodeURIComponent(id)
        }).then(function successCallback(res) {
            $scope.entries = res.data.tracks.map(function(x) {return {track:x,type:'1'}});
            $location.search({ album: id });
        }, function errorCallback(res) {
            console.log(res);
        });
    }

    $scope.load = function(id,mode,type) {
        if ($scope.query) {
            $http({
                method: 'POST',
                url: '/load',
                data: { 
                    id: id,
                    type: type,
                    mode: mode
                }
            }).then(function successCallback(res) {
                if (res.status == 202) $scope.notify(id);
            }, function errorCallback(res) {
                console.log(res); 
            });
        }
    }

    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
      sanitizePosition();

      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
      var current = $scope.toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({},current);
    }

    $scope.notify = function(id) {
        var pinTo = $scope.getToastPosition();

        $mdToast.show(
            $mdToast.simple()
              .textContent(id)
              .position(pinTo)
              .hideDelay(3000)
        );
    }

    // cheeky way of handling page refreshes
    if ($location.search()['q']) {
        $scope.query = $location.search()['q'];
        $scope.search();
    }
    else if ($location.search()['artist']) {
        $scope.artist($location.search()['artist']);
    }
    else if ($location.search()['album']) {
        $scope.album($location.search()['album']);
    }
}
