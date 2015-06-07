'use strict';

/**
 * Servei CalendarSvc.
 * Servei que s'encarrega de fer les operacions sobre la base de dades.
 **/
angular.module('eventcalendaris')
    .factory('CalendarSvc', ['Eventcalendaris', function (Eventcalendaris) {

        /** Array on es possaran el resultats obtinguts. **/
        var eventsTotals = [];


        var s = {
            /**
             * Funció per obtenir els events totals d'un usuari
             * que hi ha emmagatzemats a la base de dades.
             * @returns {Array} --> Retorna un array amb els events obtingut.
             */
            getEventsTotals: function () {
                console.log('Es demanen els events totals al servei!!');
                if (eventsTotals.length === 0) {
                    Eventcalendaris.query().$promise.then(function (eventsNous) {
                        //$scope.events = eventsNous;
                        console.log('Events recuperats');
                        console.log(eventsNous);
                        return eventsNous;
                    });
                    return Eventcalendaris.query();
                }
                return eventsTotals;
            },

            /**
             * [[Description]]
             * @param {[[Type]]} newEvents [[Description]]*/

            setEventsTotals: function (newEvents) {
                eventsTotals = newEvents;
                console.log('CALENDAR CLIENT SERVICE RECIVE FROM EVENTCALENDARI CLIENT CONTROLLER : EVENTS TOTALS: ' + eventsTotals);
                console.log(eventsTotals);
            },

            comprovarSiExisteix: function (event) {


                    //$scope.events = eventsNous;
                    var cont;

                    for (var i = 0; i < eventsTotals.length; i++) {
                        if (eventsTotals[i].nom == event.nom || eventsTotals[i].tipus == event.tipus) {
                            cont++;
                        }
                    }

                    if(cont==0)
                        return false;
                    else
                        return true;


            },

            /**
             * Funció per 'convertir' i afegir els events obtinguts des de
             * Google a la base de dades.
             * @param {Object} googleEvents --> Objecte amb els resultats
             *                                  obtinguts des de Google.
             */
            addGoogleEvents: function (googleEvents) {


                var gEvents = googleEvents.items;
                console.log('Events de Google!');
                console.log(gEvents);

                for (var i = 0; i < gEvents.length; i++) {

                    var dataInicial;
                    var dataFinal;

                    if(gEvents[i].end.dateTime == null){
                        dataInicial = gEvents[i].start.date;
                        dataFinal = gEvents[i].end.date;
                    }else{

                        dataInicial = gEvents[i].start.dateTime;
                        dataFinal = gEvents[i].end.dateTime;
                    }




                    var eventcalendari = new Eventcalendaris.api({
                        nom: gEvents[i].summary,
                        tipus: googleEvents.summary,
                        data_inici_event: dataInicial,
                        hora_inici_event: '00:00',
                        data_final_event: dataFinal,
                        hora_final_event: '00:00',
                        proveidor: 'Google',
                        toteldia: true
                    });

                    if(this.comprovarSiExisteix(eventcalendari)){

                        eventcalendari.$save(function (response) {
                            console.log('nou event desat!');
                        }, function (errorResponse) {
                            console.log('error');
                        });
                    }else{
                        console.log('existeix');
                    }




                    /*Eventcalendaris.api.query().$promise.then(function (eventsNous) {

                        console.log(eventsNous);
                    /*if (!_this.comprovarSiExisteix(eventcalendari, eventsNous)) {


                    }
                    }); */

                }
            },

            startAll: function () {
                Eventcalendaris.query().$promise.then(function (cal) {
                    eventsTotals = cal;

                    s.getEventsTotals().$promise.then(function (eventsNous) {
                        /**
                         * Recupero els events totals.
                         */
                        $rootScope.$broadcast('eventsNous', eventsNous);


                    });
                });
            }
        }
        return s;
    }]);
