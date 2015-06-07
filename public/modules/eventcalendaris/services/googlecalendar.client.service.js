'use strict';
angular.module('eventcalendaris').factory('Googlecalendar', ['$resource', '$http',
    function($resource, $http) {
        return {
            'checkAuth': function() {
                return $http({
                    method: 'GET',
                    url: '/checkauth'
                });
            },
            'getCalendars': function() {
                return $http({
                    method: 'GET',
                    url: '/googlecalendars'
                });
            },
            'getEventsByCalendarId': function(id) {
                return $http({
                    method: 'GET',
                    url: '/eventsbycalendarid/' + id
                });
            }
        }
    }
]);
