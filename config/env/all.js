'use strict';

module.exports = {
	app: {
		title: 'dailyPlanner',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'Gestiona els teus events'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/fullcalendar/dist/fullcalendar.css',
				'public/lib/bootstrap-sweetalert/lib/sweet-alert.css',
				'public/lib/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'


				
			],
			js: [
				//'public/lib/stroll/js/stroll.min.js',
				'public/lib/jquery/dist/jquery.js',				
				'public/lib/angular/angular.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/moment/moment.js',
				'public/lib/fullcalendar/dist/fullcalendar.js',				
				'public/lib/fullcalendar/dist/gcal.js',
				'public/lib/fullcalendar/dist/lang-all.js',
				'public/lib/angular-ui-calendar/src/calendar.js',
				'public/lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
				'public/lib/bootstrap-sweetalert/lib/sweet-alert.min.js',
				'public/lib/angular-file-upload/angular-file-upload.js',
				'public/lib/noty/js/noty/packaged/jquery.noty.packaged.min.js',
				'public/lib/noty/js/noty/themes/default.js',
				'public/lib/noty/js/noty/layouts/topRight.js'
				
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
