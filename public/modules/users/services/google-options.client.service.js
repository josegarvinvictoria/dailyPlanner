'use strict';
angular.module('users').factory('GoogleOptionsService', [

    function() {

    	var autoritzat = false;
        
        var svc = {
            autoritzar: function() {
                console.log('Autoritzant');
                autoritzat = true;
            },
            desAutoritzar: function() {
                console.log('DesAutoritzant');
                autoritzat = false;
            },
            getAutoritzat: function() {
                return autoritzat;
            }
        };
        return svc;
    }
]);