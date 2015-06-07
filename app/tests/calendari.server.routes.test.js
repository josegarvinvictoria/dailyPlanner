'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Calendari = mongoose.model('Calendari'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, calendari;

/**
 * Calendari routes tests
 */
describe('Calendari CRUD tests', function() {
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

		// Save a user to the test db and create new Calendari
		user.save(function() {
			calendari = {
				name: 'Calendari Name'
			};

			done();
		});
	});

	it('should be able to save Calendari instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendari
				agent.post('/calendaris')
					.send(calendari)
					.expect(200)
					.end(function(calendariSaveErr, calendariSaveRes) {
						// Handle Calendari save error
						if (calendariSaveErr) done(calendariSaveErr);

						// Get a list of Calendaris
						agent.get('/calendaris')
							.end(function(calendarisGetErr, calendarisGetRes) {
								// Handle Calendari save error
								if (calendarisGetErr) done(calendarisGetErr);

								// Get Calendaris list
								var calendaris = calendarisGetRes.body;

								// Set assertions
								(calendaris[0].user._id).should.equal(userId);
								(calendaris[0].name).should.match('Calendari Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Calendari instance if not logged in', function(done) {
		agent.post('/calendaris')
			.send(calendari)
			.expect(401)
			.end(function(calendariSaveErr, calendariSaveRes) {
				// Call the assertion callback
				done(calendariSaveErr);
			});
	});

	it('should not be able to save Calendari instance if no name is provided', function(done) {
		// Invalidate name field
		calendari.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendari
				agent.post('/calendaris')
					.send(calendari)
					.expect(400)
					.end(function(calendariSaveErr, calendariSaveRes) {
						// Set message assertion
						(calendariSaveRes.body.message).should.match('Please fill Calendari name');
						
						// Handle Calendari save error
						done(calendariSaveErr);
					});
			});
	});

	it('should be able to update Calendari instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendari
				agent.post('/calendaris')
					.send(calendari)
					.expect(200)
					.end(function(calendariSaveErr, calendariSaveRes) {
						// Handle Calendari save error
						if (calendariSaveErr) done(calendariSaveErr);

						// Update Calendari name
						calendari.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Calendari
						agent.put('/calendaris/' + calendariSaveRes.body._id)
							.send(calendari)
							.expect(200)
							.end(function(calendariUpdateErr, calendariUpdateRes) {
								// Handle Calendari update error
								if (calendariUpdateErr) done(calendariUpdateErr);

								// Set assertions
								(calendariUpdateRes.body._id).should.equal(calendariSaveRes.body._id);
								(calendariUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Calendaris if not signed in', function(done) {
		// Create new Calendari model instance
		var calendariObj = new Calendari(calendari);

		// Save the Calendari
		calendariObj.save(function() {
			// Request Calendaris
			request(app).get('/calendaris')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Calendari if not signed in', function(done) {
		// Create new Calendari model instance
		var calendariObj = new Calendari(calendari);

		// Save the Calendari
		calendariObj.save(function() {
			request(app).get('/calendaris/' + calendariObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', calendari.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Calendari instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendari
				agent.post('/calendaris')
					.send(calendari)
					.expect(200)
					.end(function(calendariSaveErr, calendariSaveRes) {
						// Handle Calendari save error
						if (calendariSaveErr) done(calendariSaveErr);

						// Delete existing Calendari
						agent.delete('/calendaris/' + calendariSaveRes.body._id)
							.send(calendari)
							.expect(200)
							.end(function(calendariDeleteErr, calendariDeleteRes) {
								// Handle Calendari error error
								if (calendariDeleteErr) done(calendariDeleteErr);

								// Set assertions
								(calendariDeleteRes.body._id).should.equal(calendariSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Calendari instance if not signed in', function(done) {
		// Set Calendari user 
		calendari.user = user;

		// Create new Calendari model instance
		var calendariObj = new Calendari(calendari);

		// Save the Calendari
		calendariObj.save(function() {
			// Try deleting Calendari
			request(app).delete('/calendaris/' + calendariObj._id)
			.expect(401)
			.end(function(calendariDeleteErr, calendariDeleteRes) {
				// Set message assertion
				(calendariDeleteRes.body.message).should.match('User is not logged in');

				// Handle Calendari error error
				done(calendariDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Calendari.remove().exec();
		done();
	});
});