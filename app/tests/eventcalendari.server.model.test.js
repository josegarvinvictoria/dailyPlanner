'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Eventcalendari = mongoose.model('Eventcalendari');

/**
 * Globals
 */
var user, eventcalendari;

/**
 * Unit tests
 */
describe('Eventcalendari Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			eventcalendari = new Eventcalendari({
				name: 'Eventcalendari Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return eventcalendari.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			eventcalendari.name = '';

			return eventcalendari.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Eventcalendari.remove().exec();
		User.remove().exec();

		done();
	});
});