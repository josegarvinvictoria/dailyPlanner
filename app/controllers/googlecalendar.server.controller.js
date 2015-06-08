'use strict';
var authed, oAuthClient;
// Google OAuth Configuration
var googleConfig = {
    clientID: '777251935734-cfecfi06tetl4hu7uf6l3o9ajjr07e9h.apps.googleusercontent.com',
    clientSecret: 'lQVpKYzIopMViswKoXR537fN',
    redirectURL: 'http://dailyplanner.com:3000/auth'
};
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Eventcalendari = mongoose.model('Eventcalendari'),
    _ = require('lodash');

// Dependency setup
var express = require('express'),
    moment = require('moment'),

    google = require('googleapis');

// Initialization
var app = express(),
    calendar = google.calendar('v3');
oAuthClient = new google.auth.OAuth2(googleConfig.clientID, googleConfig.clientSecret, googleConfig.redirectURL),
    authed = false;


/**
 * Check Google Auth
 */
exports.checkAuth = function (req, res) {

    /**
     * Si l'usuari no està autenticat, formem l'url per que s'autentifiqui a Google.
     */
    if (!authed) {
        var url = oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/calendar.readonly'
        });

        /**
         * Si l'usuari no està autentificat responem amb un codi 230 i enviem
         * la url de redireccionament en un JSON.
         */
        res.status(230).json({'url': url});
    } else {
        /**
         * Un cop que l'usuari s'autentifiqui l'enviem a la pàgina d'opcions de Google
         * a dailyPlanner.
         */
        res.redirect('/#!/settings/googleoptions');
    }
};


exports.getEventsByCalName = function (req, res) {
    var calName = req.param('name');

    Eventcalendari.find({tipus: calName}).sort('-created').populate('user', 'displayName').exec(function(err, eventcalendaris) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventcalendaris);
        }
    });




};


exports.deleteEventsByCalName = function (req, res) {
    var calName = req.param('name');

    Eventcalendari.find({tipus: calName}).sort('-created').populate('user', 'displayName').exec(function(err, eventcalendaris) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log(eventcalendaris);
            eventcalendaris.forEach(function(i) {
                Eventcalendari.findByIdAndRemove(i._id, function(){



                })
            })
            res.jsonp({message: 'Events esborrats' });
        }
    });




};




/**
 * List of Google Calendars
 */
exports.calendarList = function (req, res) {
    // If we're not authenticated, fire off the OAuth flow
    if (!authed) {
        // Generate an OAuth URL and redirect there
        var url = oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/calendar.readonly'
        });

        res.status(230).json({'url': url});
    } else {
        // Format today's date
        var today = moment().format('YYYY-MM-DD') + 'T';
        // Call google to fetch events for today on our calendar
        calendar.calendarList.list({
            auth: oAuthClient
        }, function (err, calendars) {
            if (err) {
                console.log(err);
            } else {
                // Send our JSON response back to the browser
                console.log('Successfully fetched calendars');
                res.send(calendars);
            }
        });
    }
};


/**
 * List of Google Events by Calendar ID
 */
exports.eventsList = function (req, res) {
    var idCal = req.param('id');
    console.log('idCal -->' + idCal);
    console.log('Arriba al servidor!');

    // If we're not authenticated, fire off the OAuth flow
    if (!authed) {
        // Generate an OAuth URL and redirect there
        var url = oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/calendar.readonly'
        });
        res.status(230).json({'url': url});
    } else {
        // Format today's date
        var today = moment().format('YYYY-MM-DD') + 'T';
        // Call google to fetch events for today on our calendar
        calendar.events.list({
            calendarId: idCal,
            //maxResults: 20,
            //timeMin: today + '00:00:00.000Z',
            //timeMax: today + '23:59:59.000Z',
            auth: oAuthClient
        }, function (err, events) {
            if (err) {
                console.log('Error al recuperar els events!');
                console.log(err);
            } else {
                // Send our JSON response back to the browser
                console.log('Successfully fetched events');
                res.send(events);
            }
        });
    }
};
exports.auth = function (req, res) {
    var code = req.param('code');
    if (code) {
        // Get an access token based on our OAuth code
        oAuthClient.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating');
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                console.log(tokens);
                // Store our credentials and redirect back to our main page
                oAuthClient.setCredentials(tokens);
                authed = true;
                res.redirect('/#!/settings/googleoptions');
            }
        });
    }
};

