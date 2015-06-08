'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'dailyplanner';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core', ['ui.calendar', 'ui.bootstrap', 'angularFileUpload']);

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('eventcalendaris');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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


        /**
         * Eliminar un eventcalendari existent.
         *
         * @param eventcalendari --> Eventcalendari a esborrar.
         */
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


        /**
         * Actualitzar un eventcalendari.
         */
        $scope.update = function () {
            var eventcalendari = $scope.eventcalendari;
            eventcalendari.$update(function () {
                $location.path('eventcalendaris');

                $window.location.reload();

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        /**
         * Cercar una llista amb tots els eventscalendaris.
         */
        $scope.find = function () {
            Eventcalendaris.query(function (cal) {
                $scope.eventcalendaris = cal;
            });
        };


        /**
         * Cercar un eventcalendari de la llista.
         */
        $scope.findOne = function () {
            $scope.eventcalendari = Eventcalendaris.api.get({
                eventcalendariId: $stateParams.eventcalendariId
            });
        };
    }
]);

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
             *
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
             * Funció per assignar uns nous events al servei.
             * @param {[[Type]]} newEvents [[Description]]*/

            setEventsTotals: function (newEvents) {
                eventsTotals = newEvents;
                console.log(eventsTotals);
            },

            /**
             * Funció per comprovar si un event ja existeix a eventTotals.
             *
             * @param event --> Event a comprovar.
             * @returns {boolean}
             */
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
             *
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
                }
            },

            /**
             * Funció que avisa als controlador després d'obtenir events nous.
             */
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

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('googleoptions', {
			url: '/settings/googleoptions',
			templateUrl: 'modules/users/views/settings/google-options.client.view.html'
		}).
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
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

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'FileUploader',
	function($scope, $http, $location, Users, Authentication, FileUploader) {
		$scope.user = Authentication.user;

		//Pujada d'imatges
		var uploader = $scope.uploader = new FileUploader({url:"/api/imatges", alias:"image", removeAfterUpload: true});

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});


			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.pujarImatge = function(){




			var n = noty({
				text        : "<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>  Imagen cambiada correctamente! Recarga la pagina para ver los cambios.",
				type        : 'information',
				dismissQueue: true,
				layout      : 'topLeft',
				closeWith   : ['click'],
				theme       : 'relax',
				maxVisible  : 10,
				animation   : {
					open  : 'animated bounceInLeft',
					close : 'animated bounceOutLeft',
					easing: 'swing',
					speed : 500
				}
			});



		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';
angular.module('users').factory('GoogleOptionsService', [

    function() {

    	var autoritzat = false;
        
        var svc = {
            autoritzar: function() {
                console.log('Autoritzant');
                autoritzat = true;
            },
            desAutoritzar: function() {
                console.log('DesAutoritzant');
                autoritzat = false;
            },
            getAutoritzat: function() {
                return autoritzat;
            }
        };
        return svc;
    }
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);