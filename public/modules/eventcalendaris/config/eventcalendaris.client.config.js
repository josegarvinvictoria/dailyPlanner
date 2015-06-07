'use strict';

// Configuring the Articles module
angular.module('eventcalendaris').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Eventcalendaris', 'eventcalendaris', 'dropdown', '/eventcalendaris(/create)?');
		Menus.addSubMenuItem('topbar', 'eventcalendaris', 'List Eventcalendaris', 'eventcalendaris');
		Menus.addSubMenuItem('topbar', 'eventcalendaris', 'New Eventcalendari', 'eventcalendaris/create');
	}
]);