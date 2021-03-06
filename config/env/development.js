'use strict';

module.exports = {
	db: 'mongodb://<user>:<pass>@dbh15.mongolab.com:27157/dailyplanner',
	app: {
		title: 'dailyPlanner - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'Eliminada per pujar a Git',
		clientSecret: process.env.FACEBOOK_SECRET || 'Eliminada per pujar a Git',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'Eliminada per pujar a Git',
		clientSecret: process.env.TWITTER_SECRET || 'Eliminada per pujar a Git',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'Eliminada per pujar a Git',
		clientSecret: process.env.GOOGLE_SECRET || 'Eliminada per pujar a Git',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'Eliminada per pujar a Git',
		clientSecret: process.env.GITHUB_SECRET || 'Eliminada per pujar a Git',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
