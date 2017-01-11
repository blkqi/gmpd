angular
    .module('app', [require('angular-aria'), require('angular-animate'), require('angular-material'), require('angular-resource')])
    .controller('AppCtrl', AppCtrl)
    .controller('ToastCtrl', ToastCtrl)
    .component('artistListing', {
        templateUrl: 'partials/artist_listing.tmpl.html',
        controller: ArtistListingCtrl,
        bindings: { data: '=', menu: '=' }
    })
    .component('albumListing', {
        templateUrl: 'partials/album_listing.tmpl.html',
        controller: AlbumListingCtrl,
        bindings: { data: '=', menu: '=' }
    })
    .component('trackListing', {
        templateUrl: 'partials/track_listing.tmpl.html',
        controller: TrackListingCtrl,
        bindings: { data: '=', menu: '=' }
    })
    .component('searchPage', {
        templateUrl: 'partials/search_page.tmpl.html',
        controller: SearchPageCtrl,
        bindings: { data: '=', menu: '=' }
    })
    .component('albumPage', {
        templateUrl: 'partials/album_page.tmpl.html',
        controller: AlbumPageCtrl,
        bindings: { data: '=', menu: '=' }
    })
    .component('artistPage', {
        templateUrl: 'partials/artist_page.tmpl.html',
        controller: AlbumPageCtrl,
        bindings: { data: '=', menu: '=' }
    })
    
function AppCtrl($scope, $location, $resource, $mdToast) {
    var ctrl = this;

    ctrl.menuItems = [
        {name: 'Play track', mode: 'play', type: 'track', id: 'storeId', icon: 'play_arrow'},
        {name: 'Add track',  mode: 'add',  type: 'track', id: 'storeId', icon: 'add'},
        {name: 'Play album', mode: 'play', type: 'album', id: 'albumId', icon: 'playlist_play'},
        {name: 'Add album',  mode: 'add',  type: 'album', id: 'albumId', icon: 'playlist_add'},
        {name: 'Play radio', mode: 'play', type: 'radio', id: 'storeId', icon: 'radio'},
    ];

    function notify(data) {
        $mdToast.show({
            hideDelay: 3000,
            position: 'bottom right',
            controller: 'ToastCtrl',
            templateUrl: 'partials/toast.tmpl.html',
            locals: {data: data}
        });
    }

    function search_interceptor(res) {
        ctrl.data = res.data;
        ctrl.data.tracks = ctrl.data.entries.filter((x) => x.track).map((x) => x.track);
        ctrl.data.albums = ctrl.data.entries.filter((x) => x.album).map((x) => x.album);
    }

    $scope.search_resource = $resource('/api', {q: '@q'}, {
        query: {method: 'GET', interceptor: {response: search_interceptor}}
    });

    $scope.entry_resource = $resource('/api/:type', {type: '@type', id: '@id'}, {
        fetch: {method:'GET', interceptor: {response: (res) => { ctrl.data = res.data }}},
        load: {method:'POST', interceptor: {response: (res) => { notify({status: res.status}) }}},
    });
}

function ToastCtrl($scope, data) {
    $scope.data = data;
}

function ArtistListingCtrl($scope) {
    $scope.fetch = $scope.$parent.entry_resource.fetch;
    $scope.load = $scope.$parent.entry_resource.load;
}

function AlbumListingCtrl($scope) {
    $scope.fetch = $scope.$parent.entry_resource.fetch;
    $scope.load = $scope.$parent.entry_resource.load;
}

function TrackListingCtrl($scope) {
    $scope.fetch = $scope.$parent.entry_resource.fetch;
    $scope.load = $scope.$parent.entry_resource.load;
}

function AlbumPageCtrl($scope) {
    $scope.entry_resource = $scope.$parent.entry_resource;
    $scope.fetch = $scope.$parent.entry_resource.fetch;
    $scope.load = $scope.$parent.entry_resource.load;
}

function ArtistPageCtrl($scope) {
    $scope.fetch = $scope.$parent.entry_resource.fetch;
    $scope.load = $scope.$parent.entry_resource.load;
}

function SearchPageCtrl($scope) {
    $scope.entry_resource = $scope.$parent.entry_resource;
}
