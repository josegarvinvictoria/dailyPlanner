'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Eventcalendari = mongoose.model('Eventcalendari'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, eventcalendari;

/**
 * Eventcalendari routes tests
 */
describe('Eventcalendari CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Eventcalendari
		user.save(function() {
			eventcalendari = {
				name: 'Eventcalendari Name'
			};

			done();
		});
	});

	it('should be able to save Eventcalendari instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eventcalendari
				agent.post('/eventcalendaris')
					.send(eventcalendari)
					.expect(200)
					.end(function(eventcalendariSaveErr, eventcalendariSaveRes) {
						// Handle Eventcalendari save error
						if (eventcalendariSaveErr) done(eventcalendariSaveErr);

						// Get a list of Eventcalendaris
						agent.get('/eventcalendaris')
							.end(function(eventcalendarisGetErr, eventcalendarisGetRes) {
								// Handle Eventcalendari save error
								if (eventcalendarisGetErr) done(eventcalendarisGetErr);

								// Get Eventcalendaris list
								var eventcalendaris = eventcalendarisGetRes.body;

								// Set assertions
								(eventcalendaris[0].user._id).should.equal(userId);
								(eventcalendaris[0].name).should.match('Eventcalendari Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Eventcalendari instance if not logged in', function(done) {
		agent.post('/eventcalendaris')
			.send(eventcalendari)
			.expect(401)
			.end(function(eventcalendariSaveErr, eventcalendariSaveRes) {
				// Call the assertion callback
				done(eventcalendariSaveErr);
			});
	});

	it('should not be able to save Eventcalendari instance if no name is provided', function(done) {
		// Invalidate name field
		eventcalendari.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eventcalendari
				agent.post('/eventcalendaris')
					.send(eventcalendari)
					.expect(400)
					.end(function(eventcalendariSaveErr, eventcalendariSaveRes) {
						// Set message assertion
						(eventcalendariSaveRes.body.message).should.match('Please fill Eventcalendari name');
						
						// Handle Eventcalendari save error
						done(eventcalendariSaveErr);
					});
			});
	});

	it('should be able to update Eventcalendari instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eventcalendari
				agent.post('/eventcalendaris')
					.send(eventcalendari)
					.expect(200)
					.end(function(eventcalendariSaveErr, eventcalendariSaveRes) {
						// Handle Eventcalendari save error
						if (eventcalendariSaveErr) done(eventcalendariSaveErr);

						// Update Eventcalendari name
						eventcalendari.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Eventcalendari
						agent.put('/eventcalendaris/' + eventcalendariSaveRes.body._id)
							.send(eventcalendari)
							.expect(200)
							.end(function(eventcalendariUpdateErr, eventcalendariUpdateRes) {
								// Handle Eventcalendari update error
								if (eventcalendariUpdateErr) done(eventcalendariUpdateErr);

								// Set assertions
								(eventcalendariUpdateRes.body._id).should.equal(eventcalendariSaveRes.body._id);
								(eventcalendariUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Eventcalendaris if not signed in', function(done) {
		// Create new Eventcalendari model instance
		var eventcalendariObj = new Eventcalendari(eventcalendari);

		// Save the Eventcalendari
		eventcalendariObj.save(function() {
			// Request Eventcalendaris
			request(app).get('/eventcalendaris')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Eventcalendari if not signed in', function(done) {
		// Create new Eventcalendari model instance
		var eventcalendariObj = new Eventcalendari(eventcalendari);

		// Save the Eventcalendari
		eventcalendariObj.save(function() {
			request(app).get('/eventcalendaris/' + eventcalendariObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', eventcalendari.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Eventcalendari instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eventcalendari
				agent.post('/eventcalendaris')
					.send(eventcalendari)
					.expect(200)
					.end(function(eventcalendariSaveErr, eventcalendariSaveRes) {
						// Handle Eventcalendari save error
						if (eventcalendariSaveErr) done(eventcalendariSaveErr);

						// Delete existing Eventcalendari
						agent.delete('/eventcalendaris/' + eventcalendariSaveRes.body._id)
							.send(eventcalendari)
							.expect(200)
							.end(function(eventcalendariDeleteErr, eventcalendariDeleteRes) {
								// Handle Eventcalendari error error
								if (eventcalendariDeleteErr) done(eventcalendariDeleteErr);

								// Set assertions
								(eventcalendariDeleteRes.body._id).should.equal(eventcalendariSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Eventcalendari instance if not signed in', function(done) {
		// Set Eventcalendari user 
		eventcalendari.user = user;

		// Create new Eventcalendari model instance
		var eventcalendariObj = new Eventcalendari(eventcalendari);

		// Save the Eventcalendari
		eventcalendariObj.save(function() {
			// Try deleting Eventcalendari
			request(app).delete('/eventcalendaris/' + eventcalendariObj._id)
			.expect(401)
			.end(function(eventcalendariDeleteErr, eventcalendariDeleteRes) {
				// Set message assertion
				(eventcalendariDeleteRes.body.message).should.match('User is not logged in');

				// Handle Eventcalendari error error
				done(eventcalendariDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Eventcalendari.remove().exec();
		done();
	});
});