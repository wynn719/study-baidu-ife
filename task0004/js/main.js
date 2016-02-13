require.config({
    paths: {
        backbone: 'lib/backbone-min',
        jquery: 'lib/jquery-1.11.3.min',
        underscore: 'lib/underscore-min',
        localStorage: 'lib/backbone.localStorage',
        JSON: 'lib/json2'
    }, 

    shim: {
        'underscore': {
            exports: '_'
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require(['backbone', 'views/app'], function (Backbone, App) {
    var app = new App();
    app.init();
});
