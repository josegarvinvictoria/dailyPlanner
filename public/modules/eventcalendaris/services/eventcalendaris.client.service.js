'use strict';

/**
 * Servei Eventcalendaris.
 * Servei que s'encarrega de fer les operacions sobre la base de dades.
 **/
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
            })
        };

        api().query(function (events) {
            s.setEventsTotals(events);
        });

        return s;

 }
]);

