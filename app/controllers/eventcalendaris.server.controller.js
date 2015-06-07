'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Eventcalendari = mongoose.model('Eventcalendari'),
    _ = require('lodash');

/**
 * Create a Eventcalendari
 */
exports.create = function (req, res) {
    var eventcalendari = new Eventcalendari(req.body);
    console.log('Arriba al servidor!');
    eventcalendari.user = req.user;
    console.log(req.body);
    eventcalendari.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventcalendari);
        }
    });
};

/**
 * Show the current Eventcalendari
 */
exports.read = function (req, res) {
    res.jsonp(req.eventcalendari);
};


exports.getOne = function (req, res) {
    Eventcalendari.findOne({
        nom: req.params.nom,
        tipus: req.params.tipus
    }).sort('-created').populate('user', 'displayName').exec(function (err, eventcalendaris) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventcalendaris);
        }
    });
};

/**
 * Update a Eventcalendari
 */
exports.update = function (req, res) {
    var eventcalendari = req.eventcalendari;

    eventcalendari = _.extend(eventcalendari, req.body);

    eventcalendari.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventcalendari);
        }
    });
};

/**
 * Delete an Eventcalendari
 */
exports.delete = function (req, res) {
    var eventcalendari = req.eventcalendari;

    eventcalendari.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventcalendari);
        }
    });
};

/**
 * List of Eventcalendaris
 */
exports.list = function (req, res) {
    Eventcalendari.find().sort('-created').populate('user', 'displayName').exec(function (err, eventcalendaris) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventcalendaris);
        }
    });
};

/**
 * List of Eventcalendaris for current user.
 */
exports.listCurrentUser = function (req, res) {

    var currentUser = req.session.passport.user;
    console.log('');
    console.log('EVENTCALENDARIS SERVER CONTROLLER');
    console.log('currentUserId: ' + currentUser);
    console.log('');
    Eventcalendari.find({user: currentUser}).sort('-created').populate('user', 'displayName').exec(function (err, eventcalendaris) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventcalendaris);
        }
    });
};

/**
 * Eventcalendari middleware
 */
exports.eventcalendariByID = function (req, res, next, id) {
    Eventcalendari.findById(id).populate('user', 'displayName').exec(function (err, eventcalendari) {
        if (err) return next(err);
        if (!eventcalendari) return next(new Error('Failed to load Eventcalendari ' + id));
        req.eventcalendari = eventcalendari;
        next();
    });
};

/**
 * List Google event.
 */
exports.listGoogleEvents = function (req, res) {
    var currentUser = req.session.passport.user;
    console.log('');
    console.log('EVENTCALENDARIS SERVER CONTROLLER');
    console.log('currentUserId: ' + currentUser);
    console.log('');
    Eventcalendari.find({proveidor: 'Google', user: currentUser}).exec(function (err, eventcalendaris) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventcalendaris);
        }
    });
};


/**
 * List Dailyplanner event.
 */
exports.listDPEvents = function (req, res) {
    var currentUser = req.session.passport.user;
    console.log('');
    console.log('EVENTCALENDARIS SERVER CONTROLLER');
    console.log('currentUserId: ' + currentUser);
    console.log('');
    Eventcalendari.find({
        proveidor: 'Dailyplanner',
        user: currentUser
    }).sort('-created').populate('user', 'displayName').exec(function (err, eventcalendaris) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(eventcalendaris);
        }
    });
};

/**
 * Eventcalendari authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.eventcalendari.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
