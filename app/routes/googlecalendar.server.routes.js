'use strict';
module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var googlecalendar = require('../../app/controllers/googlecalendar.server.controller');
    // Nota Routes

	/**
	 * Comprovar accés a Google Calendar. Retorna un JSON amb l'url per donar permís a l'aplicació.
	 */
    app.route('/checkauth').get(googlecalendar.checkAuth);

	/*
	 * Obtenir els events d'un calendari a partir de l'id.
	 */
	app.route('/eventsbycalendarid/:id').get(googlecalendar.eventsList);

	/**
	 *Obtenir tots els events d'un calendari a partir del nom.
	 */
	app.route('/getEventsByCalName/:name').get(googlecalendar.getEventsByCalName);

	/**
	 * Obtenir esborrar tots els events d'un calendari a partir del nom.
	 */
	app.route('/deleteEventsByCalName/:name').get(googlecalendar.deleteEventsByCalName);

	/**
	 * Obtenir els calendaris de l'usuari a Google Calendar.
	 */
    app.route('/googlecalendars').get(googlecalendar.calendarList);



    app.route('/auth').get(googlecalendar.auth);

};
