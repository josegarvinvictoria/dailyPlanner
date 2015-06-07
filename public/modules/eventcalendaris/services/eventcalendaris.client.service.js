

/* Eventcalendaris service used to communicate Eventcalendaris REST endpoints
angular.module('eventcalendaris').factory('Eventcalendaris', ['$resource',
	function($resource) {
		return $resource('eventcalendaris/:eventcalendariId', { eventcalendariId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

*/

'use strict';

//Eventcalendaris service used to communicate Eventcalendaris REST endpoints
angular.module('eventcalendaris').factory('Eventcalendaris', ['$resource', '$rootScope',
 function ($resource, $rootScope) {

        var eventsTotals = [];

        function api() {
            return $resource('eventcalendaris/:eventcalendariId', {
                eventcalendariId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });

        };
        var s = {
            getEventsTotals: function () {
                return eventsTotals;
            },
            setEventsTotals: function (e) {
                eventsTotals = e;
                $rootScope.$broadcast('eventsTotals');

            },
            api: $resource('eventcalendaris/:eventcalendariId', {
                    eventcalendariId: '@_id'
                }, {
                    update: {
                        method: 'PUT'
                    }
                }),

            comprova: $resource('/eventcalendaris/:nom/:tipus', {}, {
                update: {
                    method: 'PUT',
                    isArray: true
                },

                query: {
                    method: 'GET',
                    isArray: false
 }
            }),
        };

        api().query(function (events) {
            s.setEventsTotals(events);
        });

        return s;

 }
]);

