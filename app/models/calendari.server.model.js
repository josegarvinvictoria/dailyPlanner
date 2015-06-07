'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Calendari Schema
 */
var CalendariSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Calendari name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Calendari', CalendariSchema);