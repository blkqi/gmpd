angular
    .module('app', [require('angular-route')])
	.config(function ($routeProvider) {
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
	});
