'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Eventcalendari Schema
 */
var EventcalendariSchema = new Schema({
    nom: {
        type: String,
        default: '',
        required: 'Se requiere un título para el evento!',
        trim: true
    },
    tipus: {
        type: String,
        default: 'dailyPlanner'
    },
    data_inici_event: {
        type: Date,
        required: 'Es necesaria fecha para crear el evento!',
        trim: true
    },
    hora_inici_event: {
        type: String,
        default: null
    },
    data_final_event: {
        type: Date,
        default: null
    },
    hora_final_event: {
        type: String,
        default: null
    },
    
    proveidor: {
        type: String,
        default: 'Dailyplanner'
    },

    toteldia: {
	type: Boolean,
    default: false
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

mongoose.model('Eventcalendari', EventcalendariSchema);
