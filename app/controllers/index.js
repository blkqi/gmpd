angular
    .module('app', [require('angular-aria'), require('angular-animate'), require('angular-material'), require('angular-resource')])
    .controller('SearchController', SearchController)
    .component('artistListing', {
        templateUrl: 'partials/artist_listing.tmpl.html',
        controller: ArtistListingController,
        bindings: { data: '=', menu: '=' }
    })
    .component('albumListing', {
        templateUrl: 'partials/album_listing.tmpl.html',
        controller: AlbumListingController,
        bindings: { data: '=', menu: '=' }
    })
    .component('trackListing', {
        templateUrl: 'partials/track_listing.tmpl.html',
        controller: TrackListingController,
        bindings: { data: '=', menu: '=' }
    })
    .component('albumPage', {
        templateUrl: 'partials/album_page.tmpl.html',
        controller: AlbumPageController,
        bindings: { data: '=', menu: '=' }
    })
    
function SearchController($scope, $location, $resource, $mdToast) {
    var ctrl = this;

    ctrl.menuItems = [
        {name: 'Play track', mode: 'play', type: 'track', id: 'storeId', icon: 'play_arrow'},
        {name: 'Add track',  mode: 'add',  type: 'track', id: 'storeId', icon: 'add'},
        {name: 'Play album', mode: 'play', type: 'album', id: 'albumId', icon: 'playlist_play'},
        {name: 'Add album',  mode: 'add',  type: 'album', id: 'albumId', icon: 'playlist_add'},
        {name: 'Play radio', mode: 'play', type: 'radio', id: 'storeId', icon: 'radio'},
    ];

    function search_interceptor(res) {
        ctrl.data = res.data;
        ctrl.data.tracks = ctrl.data.entries.filter((x) => x.track).map((x) => x.track);
    }

    $scope.search_resource = $resource('/api', {q: '@q'}, {
        query: {method: 'GET', interceptor: {response: search_interceptor}}
    });

    $scope.entry_resource = $resource('/api/:type', {type: '@type', id: '@id'}, {
        show: {method:'GET', interceptor: {response: (res) => { ctrl.data = res.data }}},
        load: {method:'POST', interceptor: {response: (res) => { $scope.notify(res.status) }}},
    });

    // a lot of logic for a little toast
    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = () => {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
            .filter((pos) => $scope.toastPosition[pos])
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
        $mdToast.show($mdToast.simple().textContent(id).position(pinTo).hideDelay(3000));
    }

    /*
    // cheeky way of handling page refreshes
    switch ($location.path()) {
    case "/":
        $scope.query = $location.search()['q'];
        if ($scope.query) $scope.search();
    case "/artist":
        $scope.artist($location.search()['id']);
    case "/album":
        $scope.album($location.search()['id']);
    default:
        console.log($location.path());
    }
    */
}

function ArtistListingController($scope) {
    $scope.show = $scope.$parent.entry_resource.show;
    $scope.load = $scope.$parent.entry_resource.load;
}

function AlbumListingController($scope) {
    $scope.show = $scope.$parent.entry_resource.show;
    $scope.load = $scope.$parent.entry_resource.load;
}

function TrackListingController($scope) {
    $scope.show = $scope.$parent.entry_resource.show;
    $scope.load = $scope.$parent.entry_resource.load;
}

function AlbumPageController($scope) {
    $scope.show = $scope.$parent.entry_resource.show;
    $scope.load = $scope.$parent.entry_resource.load;
}
