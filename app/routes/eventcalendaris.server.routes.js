'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var eventcalendaris = require('../../app/controllers/eventcalendaris.server.controller');

	// Eventcalendaris Routes

	/**
	 * Obtenir tots el events d'un usuari.
	 */
	app.route('/eventcalendaris')
		.get(eventcalendaris.listCurrentUser)
		.post(users.requiresLogin, eventcalendaris.create);

	/**
	 * Obtenir un event a partir del nom i del tipus al que pertany.
	 */
    app.route('/eventcalendaris/:nom/:tipus').get(users.requiresLogin, eventcalendaris.getOne);


	/**
	 * Obtenir els events de Google Calendar d'un usuari.
	 */
    app.route('/eventcalendaris/eventsGoogle')
		.get(users.requiresLogin, eventcalendaris.listGoogleEvents);

	/**
	 * Obtenir els events de Dailyplanner d'un usuari.
	 */
    app.route('/eventcalendaris/eventsDP')
		.get(users.requiresLogin, eventcalendaris.listDPEvents);


	app.route('/eventcalendaris/:eventcalendariId')
		.get(eventcalendaris.read)
		.put(users.requiresLogin, eventcalendaris.hasAuthorization, eventcalendaris.update)
		.delete(users.requiresLogin, eventcalendaris.hasAuthorization, eventcalendaris.delete);


	/**
	 *Obtenir tots el events.
	 */
	/*app.route('/eventcalendaris')
	 .get(eventcalendaris.list)
	 .post(users.requiresLogin, eventcalendaris.create);
	 */

	// Finish by binding the Eventcalendari middleware
	app.param('eventcalendariId', eventcalendaris.eventcalendariByID);
};
