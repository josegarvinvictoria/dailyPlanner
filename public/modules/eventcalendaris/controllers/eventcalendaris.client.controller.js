'use strict';
// Eventcalendaris controller
angular.module('eventcalendaris').controller('EventcalendarisController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Eventcalendaris', 'CalendarSvc', 'Googlecalendar', '$window', '$controller',
    function ($scope, $state, $stateParams, $location, Authentication, Eventcalendaris, CalendarSvc, Googlecalendar, $window, $controller) {
        $scope.authentication = Authentication;

        /*
         * Crear un nou eventcalendari.
         */
        $scope.create = function () {
            /**
             * Creació de l'objecte eventcalendari.
             * @type {s.api|{eventcalendariId}|string}
             */
            var eventcalendari = new Eventcalendaris.api({
                nom: this.nom,
                tipus: this.tipus,
                data_inici_event: this.data_inici_event,
                hora_inici_event: this.hora_inici_event,
                data_final_event: this.data_final_event,
                hora_final_event: this.hora_final_event,
                toteldia: this.toteldia,
                user: this.user
            });
            /**
             * Redireccionem després de guardar.
             */
            eventcalendari.$save(function (response) {
                $location.path('eventcalendaris');
                $window.location.reload();
                // Clear form fields
                $scope.nom = '';
                $scope.tipus = '';
                $scope.data_inici_event = '';
                $scope.hora_inici_event = '';
                $scope.data_final_event = '';
                $scope.hora_final_event = '';
                $scope.toteldia = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



        // Remove existing Eventcalendari
        $scope.remove = function (eventcalendari) {
            $scope.eventEsborrat = eventcalendari;


            swal({
                title: "Estas segur?",
                text: "Estas a punt d'esborrar un event!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    if (eventcalendari) {
                        eventcalendari.$remove();
                        for (var i in $scope.eventcalendaris) {
                            if ($scope.eventcalendaris[i] === eventcalendari) {
                                $scope.eventcalendaris.splice(i, 1);
                            }
                        }
                    } else {
                        $scope.eventcalendari.$remove(function () {
                            $location.path('eventcalendaris');
                        });
                    }
                    console.log('Avisant als altres controladors, event eliminat!');
                    $scope.$emit('event_eliminat', $scope.eventEsborrat);
                    $window.location.reload();
                } else {
                    swal("Cancel.lat!", "L'event no s'ha esborrat!", "error");
                }
            });


        };
        // Update existing Eventcalendari
        $scope.update = function () {
            var eventcalendari = $scope.eventcalendari;
            eventcalendari.$update(function () {
                $location.path('eventcalendaris/' + eventcalendari._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // Find a list of Eventcalendaris
        $scope.find = function () {
            Eventcalendaris.query(function (cal) {
                $scope.eventcalendaris = cal;
            });
        };


        // Find existing Eventcalendari
        $scope.findOne = function () {
            $scope.eventcalendari = Eventcalendaris.api.get({
                eventcalendariId: $stateParams.eventcalendariId
            });
        };
    }
]);
