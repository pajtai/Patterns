(function () {
    'use strict';

// Require.js allows us to configure shortcut alias
    require.config({
        paths : {
            jquery : '../vendor/jquery/jquery',
            rivets : '../vendor/rivets/dist/rivets',
            backbone : '../vendor/backbone-amd/backbone',
            text : '../vendor/requirejs-text/text'
        },
        packages : [
            {
                name : 'underscore',
                location : '../vendor/lodash-amd/underscore'
            },
            {
                name : 'masseuse',
                location : '../vendor/masseuse/app'
            }
        ]
    });

    require(['masseuse'],
        function (masseuse) {
            new masseuse.plugins.rivets.RivetsView({
                el : 'body',
                template : '<div data-rv-text="model:field"></div><input data-rv-value="model:field" type="text">',
                rivetsInstaUpdate : true
            }).start();
        });
}());
