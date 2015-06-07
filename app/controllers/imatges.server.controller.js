'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');
var Users = mongoose.model('User');

/**
 * Create a Imatge
 */
exports.create = function(req, res) {
    var currentUser = req.session.passport.user;

    var id = mongoose.Types.ObjectId(currentUser);

    Users.findOneAndUpdate({'_id': id}, {'img' : req.files.image.name}, function(err){
       if(err){
           console.log(err);
       } else{
           console.log('Imatge pujada correctament');


       }
    });

};

/**
 * Show the current Imatge
 */
exports.read = function(req, res) {

};

/**
 * Update a Imatge
 */
exports.update = function(req, res) {

};

/**
 * Delete an Imatge
 */
exports.delete = function(req, res) {

};

/**
 * List of Imatges
 */
exports.list = function(req, res) {
    var currentUser = req.session.passport.user;
    var id= mongoose.Types.ObjectId(currentUser);

    Users.findById(id, function(err, img){
        if(err){
            console.log(err);
        }else {
            var options = {
                root: __dirname + '../../../public/uploads',
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };


            if(img != null) {
                var filename = img.img;
                if (filename != undefined) {
                    res.sendFile(filename, options, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Imatge enviada al servidor ' + filename);
                            img.img = filename;
                        }
                    })
                }
            }

        }
    })



};
