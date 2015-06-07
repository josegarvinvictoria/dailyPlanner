'use strict';

//Setting up route
angular.module('eventcalendaris').config(['$stateProvider',
	function($stateProvider) {
		// Eventcalendaris state routing
		$stateProvider.
		state('listEventcalendaris', {
			url: '/eventcalendaris',
			templateUrl: 'modules/eventcalendaris/views/list-eventcalendaris.client.view.html'
		}).
		state('createEventcalendari', {
			url: '/eventcalendaris/create',
			templateUrl: 'modules/eventcalendaris/views/create-eventcalendari.client.view.html'
		}).
		state('viewEventcalendari', {
			url: '/eventcalendaris/:eventcalendariId',
			templateUrl: 'modules/eventcalendaris/views/view-eventcalendari.client.view.html'
		}).
		state('editEventcalendari', {
			url: '/eventcalendaris/:eventcalendariId/edit',
			templateUrl: 'modules/eventcalendaris/views/edit-eventcalendari.client.view.html'
		});
	}
]);
