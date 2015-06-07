'use strict';

module.exports = function(app) {
	var upload = require('../../app/controllers/imatges.server.controller');

    /**
     * Pujar una imatge al servidor.
     */
    app.route('/api/imatges')
        .post(upload.create);

    /**
     * Obtenir l'imatge d'un usuari.
     */
    app.route('/api/llistaimatges')
        .get(upload.list);

};
