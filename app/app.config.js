angular
    .module('app', [require('angular-route')])
	.config(function ($routeProvider, $locationProvider) {
		$routeProvider
		  .when('/', {
			templateUrl: 'index.html',
			reloadOnSearch: false,
			controller: 'SearchController',
			controllerAs: 'main'
		  })
		  .otherwise({
			redirectTo: '/'
		  });
        $locationProvider.html5Mode(true);
	});
