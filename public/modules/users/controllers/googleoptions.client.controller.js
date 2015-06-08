'use strict';

/** Controlador GoogleoptionsController. **/
angular.module('users').controller('GoogleoptionsController', ['$scope', 'Googlecalendar', '$window', 'GoogleOptionsService', 'CalendarSvc',
    function ($scope, Googlecalendar, $window, GoogleOptionsService, CalendarSvc) {
        $scope.autoritzat = false;
        $scope.calendaris = null;
        $scope.calendarisRecuperats = false;

        console.log('autoritzat----->' + $scope.autoritzat);

        $scope.init = function () {


            $scope.getCalendars();

        };


        /**
         * Funció que s'encarrega de realitzar l'autentificació.
         */
        $scope.checkAuth = function () {
            Googlecalendar.checkAuth().
                success(function (data, status, headers, config) {
                    if (status == 230) {
                        swal({
                            title: "Estas segur?",
                            text: "Estas a punt de donar accés als teus calendaris de Google. Vols continuar?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55", confirmButtonText: "Si!", cancelButtonText: "No, no vull donar accès!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        }, function (isConfirm) {
                            if (isConfirm) {
                                $window.location.href = data.url;
                                //$scope.autoritzat = true;
                            } else {
                                swal('Cancel.lat!', 'No s\'han donat permissos a Dailyplanner per veure el calendaris.', 'error');
                            }
                        });
                        //
                    } else {
                        swal("Ja has donat permis!")
                        console.warn('Autentificació Google Calendar OK!');
                        console.log(data);
                        console.warn(status);
                        console.warn(headers);
                    }
                }).
                error(function (data, status, headers, config) {
                    console.warn('Hi ha hagut un error al comprovar l\'autentificació');
                    console.warn(data);
                    console.warn(status);
                    console.warn(headers);
                    console.warn(config);
                });
        };


        /**
         * Funció per obtenir els calendaris a Google de l'usuari.
         */
        $scope.getCalendars = function () {
            Googlecalendar.getCalendars().
                success(function (data, status, headers, config) {
                    if (status == 230) {
                        console.log('No es té permís...redireccionant..');
                        $window.location.href = data.url;
                    }
                    console.info('Calendaris recuperats!');
                    $scope.calendaris = data.items;
                    $scope.calendarisRecuperats = true;
                    console.log($scope.calendaris);
                }).
                error(function (data, status, headers, config) {
                    console.warn('Error al recuperar els calendaris...');
                });
        };

        /** Funcion que s'encarrega d'importar calendaris des de Google
         *  Calendar, a partir de l'id.
         */
        $scope.importCalendar = function (calendar) {
            var nevents;
            swal({
                title: "Estas segur?",
                text: "Segur que vols importar tots els events del calendari \"" +calendar.summary +"\"!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    //Cal comprovar si ja exiteixen events importats des de aquest calendari.
                    Googlecalendar.getEventsByCalendarId(encodeURIComponent(calendar.id)).
                        success(function (data, status, headers, config) {
                            console.info('Events recuperats AMB REPETITS');
                            console.info(data.items);
                            nevents = data.items.length;
                            CalendarSvc.addGoogleEvents(data);
                            console.info('Event enviats al servei!');
                            swal("Events importats", "S'han importat un total de " + nevents  + " events!", "success");
                        }).
                        error(function (data, status, headers, config) {
                            swal("Error", "S'han trobat errors a l'hora d'importat els events...", "error")
                        });

                } else {
                    swal("Error", "No s'han importat events", "error");
                }
            });



        };


        /**
         $scope.importCalendar = function(calendar){

          console.log('Calendari a importar nou!');
          console.log(calendar.id);
          console.log(encodeURIComponent(calendar.id));
          console.log($scope.recoveredEvents);

          Googlecalendar.getEventsByCalendarId().
            success(function(data, status, headers, config) {
                if (status == 230) {
                    console.log('No es té permís...redireccionant..');
                    $window.location.href = data.url;
                }
                console.warn('Calendaris recuperats!');
                $scope.calendaris = data.items;
                $scope.calendarisRecuperats = true;
                console.log($scope.calendaris);
            }).
            error(function(data, status, headers, config) {
                console.warn('Error al recuperar els calendaris...');
            });
        };**/


    }
]);
