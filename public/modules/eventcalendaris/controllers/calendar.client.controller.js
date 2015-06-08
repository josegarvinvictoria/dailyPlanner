'use strict';

/** Controlador CalendarController. **/
angular.module('eventcalendaris').controller('CalendarController', ['$scope', '$controller', '$timeout', '$stateParams', '$location', 'Authentication', 'Eventcalendaris', 'CalendarSvc', '$compile', 'uiCalendarConfig', '$window',
    function ($scope, $controller, $timeout, $stateParams, $location, Authentication, Eventcalendaris, CalendarSvc, $compile, uiCalendarConfig, $window) {

        /*
         * Array d'objectes on es col.locaran els events organitzats en calendaris.
         */
        $scope.calendaris = [];


        /**
         * Array model del calendari. En aquest array es col.locaran tots els events
         * que s'han de mostrar al calendari.
         *
         * @type {Array}
         */
        $scope.eventSources = [];

        /**
         * Configuració de escollida per al calendari.
         */
        $scope.uiConfig = {
            calendar: {
                height: 580,
                width: 450,
                editable: true,
                lang: 'es',
                header: {
                    left: 'today prev,next',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };

        /**
         * Funció per cambiar de vista al calendari.
         * @param calendar
         */
        $scope.renderCalender = function (calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };

        /*
         * Variables utilitzades per el calendari.
         */
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        /**
         * Variable per determinar si cal mostrar o no el missatge "No hi ha events".
         * @type {boolean}
         */
        $scope.noEvents = false;


        /**
         * Funció per donar format a la data a abans de ser mostrada a la llista.
         * @param date
         * @returns {string}
         */
        $scope.formatDate = function (date) {
            return date.substring(0, 10);
        };

        /**
         * Funció per donar format a l'hora a abans de ser mostrada a la llista.
         *
         * @param date
         * @returns {string}
         */
        $scope.formatTime = function (date) {
            return date.substring(0, 10);
        };

        /**
         * Funció que es dispara quan s'elimina un event de la llista i
         * que s'encarrega d'eliminar l'event del calendari Angular.
         */

        $scope.$on("event_eliminat", function (event, data) {
            var indexCalEvent = -1;

            console.log('Rebut! Cal eliminar un event!');
            console.log(data);


            //Cerco el calendari al que pertany
            for (var i = 0; i < $scope.calendaris.length; i++) {
                if (data.tipus == $scope.calendaris[i].nom) {
                    indexCalEvent = i;
                }
            }

            //Elimino l'event a partir de l'index del calendari al que pertany.
            for (var i = 0; i < $scope.calendaris[indexCalEvent].events.length; i++) {
                if ($scope.calendaris[indexCalEvent].events[i]._id == data._id) {
                    $scope.calendaris[indexCalEvent].events.splice(i, 1);

                }
            }
            $scope.eEsborrat = true;
        });


        $scope.eventsTotals = [];

        /**
         * Funció que comprova si hi ha events per mostrar, els organitza en calendaris,
         * i els possa a eventSources, que és el model del calendari. Tot el que col.loquem a
         * eventSources amb un format correcte es pintarà al calendari.
         */
        $scope.init = function () {
            /*
             * Es comprova si hi ha events per mostrar, si no n'hi ha'n,
             * es demanen al servei.
             */
            if ($scope.eventsTotals.length === 0) {
                $scope.$on('eventsTotals', function () {
                    $scope.eventsTotals = Eventcalendaris.getEventsTotals();

                    /**
                     * Un cop es tenen els event, s'organitzen en calendaris.
                     */
                    $scope.generateCalendars();

                    /**
                     * A partir dels calendaris generats pintem els events al calendari.
                     */
                    for (var i = 0; i < $scope.calendaris.length; i++) {

                        /**
                         * Abans d'agefir els events al calendari caldrà que els tranformem
                         * a un format entendible per el calendari.
                         *
                         * @type {Array} --> Array amb els events a pintar al calendari.
                         */
                        var a = $scope.eventToCalendarEvent($scope.calendaris[i]);

                        /**
                         * Afegim els events "transformats" al model del calendari "eventSource".
                         */
                        $scope.eventSources.push(a);

                    }

                    if ($scope.calendaris.length === 0) {
                        $scope.noEvents = true;
                    }
                });
            } else {

                /**
                 * Si ja es tenen events, els organitzem en calendaris.
                 */
                $scope.generateCalendars();

                /**
                 * I els passem al model amb un format entendible per el calendari.
                 */
                for (var i = 0; i < $scope.calendaris.length; i++) {
                    var a = $scope.eventToCalendarEvent($scope.calendaris[i]);
                    $scope.eventSources.push(a);

                }
            }
        };


        /**
         * Pintar events al calendari.
         *
         * @param event --> Events
         * @param element --> Element
         * @param view --> Vista del calendari.
         */
        $scope.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };


        /**
         * Funció que transforma un array d'events normals (format model) a un array d'events
         * aptes per a l'utilització al calendari.
         *
         * @param   {Array} events --> Array amb els events en format normal (model).
         * @returns {Array} --> Retorna un array amb els events en un format apte
         *                      per ser manegats per Angular UI Calendar.
         */
        $scope.eventToCalendarEvent = function (calendari) {
            var events = calendari.events;
            var calendarEvents = [];
            for (var i = 0; i < events.length; i++) {
                //Recullo l'informació dels events i la tradueixo per tal
                // de que el calendari els pugui manegar,
                var titleN = events[i].nom;
                var everydayN = events[i].toteldia;
                var startY = events[i].data_inici_event.substring(0, 4);
                var startM = events[i].data_inici_event.substring(5, 7);
                var startD = events[i].data_inici_event.substring(8, 10);
                if (everydayN) {
                    var e = {
                        title: titleN,
                        start: new Date(startY, startM - 1, startD),
                        allDay: true
                    };
                    calendarEvents.push(e);
                } else {
                    var endY = events[i].data_final_event.substring(0, 4);
                    var endM = events[i].data_final_event.substring(5, 7);
                    var endD = events[i].data_final_event.substring(8, 10);

                    var e = {
                        title: titleN,
                        start: new Date(startY, startM - 1, startD),
                        end: new Date(endY, endM - 1, endD),
                        allDay: false
                    };
                    calendarEvents.push(e);
                }
            }
            console.log('Events traduïts');
            return calendarEvents;
        };


        /**
         * Funció per generar els calendaris a partir de l'array d'eventsTotals.
         */
        $scope.generateCalendars = function () {

            for (var i = 0; i < $scope.eventsTotals.length; i++) {
                var calendarName = $scope.eventsTotals[i].tipus;
                if ($scope.getCalendarIndex(calendarName) == -1) {

                    var nCal = {
                        nom: calendarName,
                        events: []
                    }

                    nCal.events.push($scope.eventsTotals[i]);
                    $scope.calendaris.push(nCal);
                } else {
                    $scope.calendaris[$scope.getCalendarIndex(calendarName)].events.push($scope.eventsTotals[i]);
                }

            }
        };


        /**
         * Funció per obtenir l'index del calendari a l'array de calendaris
         * a partir d'un nom.
         *
         * @param calendarName --> Nom del calendari.
         * @returns {number} --> Index del calendari a l'array calendaris.
         */
        $scope.getCalendarIndex = function (calendarName) {

            for (var i = 0; i < $scope.calendaris.length; i++) {

                if ($scope.calendaris[i].nom == calendarName) {
                    return i;
                }

            }
            return -1;
        };

        /**
         * Obtenir tots element d'un determinat tipus.
         * @param type --> Tipus dels events a cercar.
         * @returns {Array} --> Event trobats.
         */
        $scope.getEventsByType = function (type) {
            var e = [];
            for (var i = 0; i < $scope.eventsTotals.length; i++) {
                if ($scope.eventsTotals[i].tipus == type) {
                    e.push($scope.eventsTotals[i]);
                }
            }
            return e;
        };


        /**
         * Add and removes an event source of choice.
         */
        $scope.addRemoveEventSource = function (sources, source) {
            var canAdd = 0;
            angular.forEach(sources, function (value, key) {
                if (sources[key] === source) {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0) {
                sources.push(source);
            }
        };
    }
]);
