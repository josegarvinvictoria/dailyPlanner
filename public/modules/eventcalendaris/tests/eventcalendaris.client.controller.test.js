'use strict';

(function() {
	// Eventcalendaris Controller Spec
	describe('Eventcalendaris Controller Tests', function() {
		// Initialize global variables
		var EventcalendarisController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Eventcalendaris controller.
			EventcalendarisController = $controller('EventcalendarisController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Eventcalendari object fetched from XHR', inject(function(Eventcalendaris) {
			// Create sample Eventcalendari using the Eventcalendaris service
			var sampleEventcalendari = new Eventcalendaris({
				name: 'New Eventcalendari'
			});

			// Create a sample Eventcalendaris array that includes the new Eventcalendari
			var sampleEventcalendaris = [sampleEventcalendari];

			// Set GET response
			$httpBackend.expectGET('eventcalendaris').respond(sampleEventcalendaris);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.eventcalendaris).toEqualData(sampleEventcalendaris);
		}));

		it('$scope.findOne() should create an array with one Eventcalendari object fetched from XHR using a eventcalendariId URL parameter', inject(function(Eventcalendaris) {
			// Define a sample Eventcalendari object
			var sampleEventcalendari = new Eventcalendaris({
				name: 'New Eventcalendari'
			});

			// Set the URL parameter
			$stateParams.eventcalendariId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/eventcalendaris\/([0-9a-fA-F]{24})$/).respond(sampleEventcalendari);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.eventcalendari).toEqualData(sampleEventcalendari);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Eventcalendaris) {
			// Create a sample Eventcalendari object
			var sampleEventcalendariPostData = new Eventcalendaris({
				name: 'New Eventcalendari'
			});

			// Create a sample Eventcalendari response
			var sampleEventcalendariResponse = new Eventcalendaris({
				_id: '525cf20451979dea2c000001',
				name: 'New Eventcalendari'
			});

			// Fixture mock form input values
			scope.name = 'New Eventcalendari';

			// Set POST response
			$httpBackend.expectPOST('eventcalendaris', sampleEventcalendariPostData).respond(sampleEventcalendariResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Eventcalendari was created
			expect($location.path()).toBe('/eventcalendaris/' + sampleEventcalendariResponse._id);
		}));

		it('$scope.update() should update a valid Eventcalendari', inject(function(Eventcalendaris) {
			// Define a sample Eventcalendari put data
			var sampleEventcalendariPutData = new Eventcalendaris({
				_id: '525cf20451979dea2c000001',
				name: 'New Eventcalendari'
			});

			// Mock Eventcalendari in scope
			scope.eventcalendari = sampleEventcalendariPutData;

			// Set PUT response
			$httpBackend.expectPUT(/eventcalendaris\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/eventcalendaris/' + sampleEventcalendariPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid eventcalendariId and remove the Eventcalendari from the scope', inject(function(Eventcalendaris) {
			// Create new Eventcalendari object
			var sampleEventcalendari = new Eventcalendaris({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Eventcalendaris array and include the Eventcalendari
			scope.eventcalendaris = [sampleEventcalendari];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/eventcalendaris\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEventcalendari);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.eventcalendaris.length).toBe(0);
		}));
	});
}());