'use strict';

/** Controlador CalendarController. **/
angular.module('eventcalendaris').controller('CalendarController', ['$scope', '$controller', '$timeout', '$stateParams', '$location', 'Authentication', 'Eventcalendaris', 'CalendarSvc', '$compile', 'uiCalendarConfig', '$window',
    function ($scope, $controller, $timeout, $stateParams, $location, Authentication, Eventcalendaris, CalendarSvc, $compile, uiCalendarConfig, $window) {

        /*
         * Array d'objectes on es col.locaran els events organitzats en calendaris.
         */
        $scope.calendaris = [];

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
        $scope.formatDate = function(date){
            return date.substring(0,10);
        };

        /**
         * Funció per donar format a l'hora a abans de ser mostrada a la llista.
         *
         * @param date
         * @returns {string}
         */
        $scope.formatTime = function(date){
            return date.substring(0,10);
        };

        /**
         * Funció que es dispara quan s'elimina un event de la llista i
         */

        $scope.$on("event_eliminat", function(event, data)
        {
            var indexCalEvent = -1;

            console.log('Rebut! Cal eliminar un event!');
            console.log(data);



            //Cerco el calendari al que pertany
            for(var i = 0; i<$scope.calendaris.length; i++) {
                if (data.tipus == $scope.calendaris[i].nom) {
                    indexCalEvent = i;
                }
            }

            //Elimino l'event a partir de l'index del calendari al que pertany.
            for(var i = 0; i<$scope.calendaris[indexCalEvent].events.length; i++){
                if($scope.calendaris[indexCalEvent].events[i]._id == data._id){
                    $scope.calendaris[indexCalEvent].events.splice(i, 1);

                }
            }
            $scope.eEsborrat = true;
        });


        /*var EventcalendarisController = $scope.$new();

        $controller('EventcalendarisController', {
            $scope: EventcalendarisController
        });
        EventcalendarisController.myMethod();*/

        $scope.eventsTotals = [];

        $scope.init = function () {
            //
            /*if($scope.eventSources.length != 0){
                console.log('Refresh!');
                $window.location.reload();
            }*/
            //EventcalendarisController.find();
            //$scope.getAllEvents();
            $scope.eventsTotals = Eventcalendaris.getEventsTotals();
            if ($scope.eventsTotals.length === 0) {
                $scope.$on('eventsTotals', function () {
                    $scope.eventsTotals = Eventcalendaris.getEventsTotals();
                    $scope.generateCalendars();

                    for(var i = 0; i<$scope.calendaris.length;i++){
                        var a = $scope.eventToCalendarEvent($scope.calendaris[i]);
                        $scope.eventSources.push(a);

                    }

                    if($scope.calendaris.length === 0){
                        $scope.noEvents = true;
                    }
                    //$scope.orderEvents();
                });
            }else{

                $scope.generateCalendars();

                for(var i = 0; i<$scope.calendaris.length;i++){
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

        /* Change View */
        $scope.renderCalender = function (calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };



        /**
         * Funció que transforma un array d'events normal a un array d'events
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

                    console.log('Inici--> ' + titleN + ' ' + everydayN + ' ' + startY + ' ' + startM + ' ' + startD);
                    console.log('Final--> ' + endY + ' ' + endM + ' ' + endD);
                }
            }
            console.log('Events traduïts');
            console.log(calendarEvents);
            return calendarEvents;
        };


        $scope.generateCalendars = function () {

            for (var i = 0; i < $scope.eventsTotals.length; i++) {
                var calendarName = $scope.eventsTotals[i].tipus;
                if ($scope.getCalendarIndex(calendarName) == -1) {

                    var nCal = {
                        nom: calendarName,
                        color: '#f00',
                        textColor: 'yellow',
                        events: []
                    }

                    nCal.events.push($scope.eventsTotals[i]);
                    $scope.calendaris.push(nCal);
                } else{
                    $scope.calendaris[$scope.getCalendarIndex(calendarName)].events.push($scope.eventsTotals[i]);
                }

            }

            /*
            for(var i = 0; i< $scope.calendaris.length; i++){
                $scope.eventSources.push($scope.calendaris[i]);
            }
            */
        };


        $scope.getCalendarIndex = function (calendarName) {

            for (var i = 0; i < $scope.calendaris.length; i++) {

                if ($scope.calendaris[i].nom == calendarName) {
                    return i;
                }

            }

            return -1;


        };



        /**
         * Funció per afegir un array d'events al calendari principal.
         * @param {Array} eventsNous --> Events afegits.
         */
        $scope.addEventsToMainCalendar = function (eventsNous) {
            console.log('Clearing $scope.events via splice(0)');
            console.log('CALENDAR CLIENT CONTROLLER RECIVE NEW EVENTS ' + eventsNous);
            console.log('EVENTS NOUS ');
            console.log(eventsNous);

            // Create temp events array.
            var newEvents = $scope.eventToCalendarEvent(eventsNous);
            console.log('NEW EVENTS ');
            console.log(newEvents);
            // Push newEvents into events, one by one.
            angular.forEach(newEvents, function (event) {
                $scope.events.events.push(event);
            });
        };

        $scope.addEventsToGCalendar = function (eventsNous) {
            $scope.n = $scope.eventToCalendarEvent(eventsNous);

            // Push newEvents into events, one by one.
            angular.forEach($scope.n, function (event) {
                $scope.events2.events.push(event);
            });
        };


        $scope.getEventsByType = function (type) {
            var e = [];
            for (var i = 0; i < $scope.eventsTotals.length; i++) {
                if ($scope.eventsTotals[i].tipus == type) {
                    e.push($scope.eventsTotals[i]);
                }
            }
            return e;
        };



        $scope.orderEvents = function () {

            /**
             * Recupero els events totals.
             */
            //$scope.eventsTotals = eventsNous;

            /**
             * Cerco a la llista els events i els ordeno a partir del tipus.
             */




            $scope.addEventsToMainCalendar($scope.getEventsByType('dailyPlanner Event'));
            $scope.addEventsToGCalendar($scope.getEventsByType('Google Calendar Event'));


        };

        $scope.getRandomColor = function () {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        /* add and removes an event source of choice */
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
        /* event sources array*/
        $scope.eventSources = [];

        $scope.sources = '';
        $scope.source = '';
        /* add custom event*/
        $scope.addEvent = function () {};

    }


    /** ESTRUCTURA EVENTS

    {
            title: 'All Day Event',
            start: new Date(y, m, 1),
            editable: true
        }, {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2)
        }, {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d - 3, 16, 3),
            allDay: true
        }, {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d + 4, 16.5, 0),
            allDay: false
        }, {
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false
        }, {
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'
        }




    **/



    /**        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        console.log(uiCalendarConfig);
        $scope.init = function() {
            $scope.uiCalendarConfig = {
                calendar: {
                    
                        height: 450,
                        editable: true,
                        lang: 'ca',
                        header: {
                            left: 'title',
                            center: '',
                            right: 'today prev,next'
                        },
                        //defaultDate: new Date(y, m, d),
                        eventClick: $scope.alertOnEventClick,
                        eventDrop: $scope.alertOnDrop,
                        eventResize: $scope.alertOnResize,
                        eventRender: $scope.eventRender

                }
            };
        };
        $scope.changeTo = 'Catalan';
        /* event source that pulls from google.com
        $scope.eventSource = {
            //url: 'https://www.google.es/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0CCQQFjAA&url=https%3A%2F%2Fwww.google.com%2Fcalendar%2Fical%2Fes.spain%2523holiday%40group.v.calendar.google.com%2Fpublic%2Fbasic.ics&ei=hO1iVdywDciwUcWGgsgF&usg=AFQjCNHFru6gIoJaqPkYk61bUqPHK1Mxhg&sig2=dNmptBv9IhdIVJDflRypDQ',
            url: '',
            className: 'gcal-event', // an option!
            currentTimezone: 'Spain/Madrid' // an option!
        };
        $scope.events = [];
        /**{
            title: 'All Day Event',
            start: new Date(y, m, 1)
        }, {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2)
        }, {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d - 3, 16, 0),
            allDay: false
        }, {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d + 4, 16, 0),
            allDay: false
        }, {
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false
        }, {
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'
        }];
        $scope.eventsF = function(start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{
                title: 'Feed Me ' + m,
                start: s + (50000),
                end: s + (100000),
                allDay: false,
                className: ['customFeed']
            }];
            callback(events);
        };
        $scope.calEventsExt = {
            color: '#f00',
            textColor: 'yellow',
            events: [{
                type: 'party',
                title: 'Lunch',
                start: new Date(y, m, d, 12, 0),
                end: new Date(y, m, d, 14, 0),
                allDay: false
            }, {
                type: 'party',
                title: 'Lunch 2',
                start: new Date(y, m, d, 12, 0),
                end: new Date(y, m, d, 14, 0),
                allDay: false
            }, {
                type: 'party',
                title: 'Anar a Google',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                url: 'http://google.com/'
            }]
        };
        // Clear events via splice(0) and then push into events source.
        $scope.getEventsEmptySplice = function(eventsNous) {
            console.log('Clearing $scope.events via splice(0)');
            console.log('CALENDAR CLIENT CONTROLLER RECIVE NEW EVENTS ' + eventsNous);
            console.log('EVENTS NOUS ');
            console.log(eventsNous);
            // Clearing in this manner maintains the two-way data bind.
            // This can be called over and over, with old events cleared,
            // and new random events displayed. This no longer works
            // if getEventsEmptyArray is ever called, due to two-way
            // data bind being broken within that function.
            //$scope.events.splice(0);
            // Get 3 random days, 1-28
            var day1 = Math.floor(Math.random() * (28 - 1)) + 1;
            var day2 = Math.floor(Math.random() * (28 - 1)) + 1;
            var day3 = Math.floor(Math.random() * (28 - 1)) + 1;
            // Simulating an AJAX request with $timeout.
            $timeout(function() {
                // Create temp events array.
                var newEvents = $scope.eventToCalendarEvent(eventsNous);
                console.log('NEW EVENTS ');
                console.log(newEvents);
                // Push newEvents into events, one by one.
                angular.forEach(newEvents, function(event) {
                    $scope.events.push(event);
                });
                console.log('New Events pushed');
                $scope.eventToCalendarEvent(eventsNous);
            }, 100);
        };
        /* $scope.uiConfig = {
            calendar:{
              height: 450,
              editable: false,
              header:{
                left: 'title',
                center: '',
                right: 'today prev,next'
              },
              defaultDate: new Date(y, m , d),
              eventClick: $scope.alertOnEventClick,
              titleFormat:{
                month: 'YYYY年 MMMM',
              },
              monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
              dayNamesShort: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
              buttonText: {
                today:'今日'
              },
            }
          }; */
    /* event source that contains custom events on the scope
        $scope.events = [{
            title: 'All Day Event',
            start: new Date(y, m, 3)
        }, {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2)
        }, {
            id: 999,
            title: 'Eiii mauro',
            start: new Date(y, m, 23),
            allDay: false
        }, {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d + 4, 16, 0),
            allDay: false
        }, {
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false
        }, {
            title: 'Anar a Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'
        }];*/
    /* event source that calls a function on every view switch
        /* alert on eventClick
        $scope.alertOnEventClick = function(date, jsEvent, view) {
            $scope.alertMessage = (date.title + ' was clicked ');
        };
        /* alert on Drop
        $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize
        $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice
        $scope.addRemoveEventSource = function(sources, source) {
            var canAdd = 0;
            angular.forEach(sources, function(value, key) {
                if (sources[key] === source) {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0) {
                sources.push(source);
            }
        };
        /* add custom event
        $scope.addEvent = function() {
            $scope.events.push({
                title: 'All Day Event',
                start: new Date(y, m, 1)
            });
            console.log('Event afegit correctament!');
        };
        $scope.getAllEvents = function() {
            /**var eventsNous = CalendarSvc.getEventsTotals();
            console.log('CALENDAR CLIENT CONTROLLER RECIVE NEW EVENTS ' + eventsNous);
            console.log('EVENTS NOUS ');
            console.log(eventsNous);
            $scope.getEventsEmptySplice();
            CalendarSvc.getEventsTotals().$promise.then(function(eventsNous) {
                //$scope.events = eventsNous;
                $scope.getEventsEmptySplice(eventsNous);
            });
        };
        /* remove event
        $scope.remove = function(index) {
            $scope.events.splice(index, 1);
        };
        /* Change View
        $scope.changeView = function(view, calendar) {
            $scope.uiCalendarConfig.calendar.fullCalendar('changeView', view);
        };
        /* Change View
        $scope.renderCalender = function(calendar) {
            if ($scope.uiCalendarConfig.calendar) {
                $scope.uiCalendarConfig.calendar.fullCalendar('render');
            }
        };
        /* Render Tooltip
        $scope.eventRender = function(event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        $scope.changeLang = function() {
            if ($scope.changeTo === 'Hungarian') {
                $scope.uiConfig.calendar.dayNames = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
                $scope.uiConfig.calendar.dayNamesShort = ['Vas', 'Hét', 'Kedd', 'Sze', 'Csüt', 'Pén', 'Szo'];
                $scope.changeTo = 'English';
            } else {
                $scope.uiConfig.calendar.dayNames = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Disabte'];
                $scope.uiConfig.calendar.dayNamesShort = ['Dium', 'Dillu', 'Dima', 'Dime', 'Dijo', 'Dive', 'Disa'];
                $scope.changeTo = 'Catalan';
            }
        };
        $scope.eventToCalendarEvent = function(events) {
            var calendarEvents = [];
            for (var i = 0; i < events.length; i++) {
                //Recullo l'informació dels events i la tradueixo per tal
                // de que el calendari els pugui manegar,
                var titleN = events[i].nom;
                var startY = parseInt(events[i].data_event.substring(0, 4));
                var startM = parseInt(events[i].data_event.substring(5, 7));
                var startD = parseInt(events[i].data_event.substring(8, 10));
                console.log(startY + ' ' + startM + ' ' + startD);
                var e = {
                    title: titleN,
                    start: new Date(startY, startM - 1, startD)
                };
                calendarEvents.push(e);
            }
            console.log('Events traduïts');
            console.log(calendarEvents);
            return calendarEvents;
        };
        /* event sources array
        $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
        $scope.init();
    }*/
]);
