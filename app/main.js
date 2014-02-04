(function () {
    'use strict';

// Require.js allows us to configure shortcut alias
    require.config({
        paths : {
            jquery : 'vendor/jquery/jquery',
            rivets : 'vendor/rivets/dist/rivets',
            backbone : 'vendor/backbone-amd/backbone',
            text : 'vendor/requirejs-text/text',
            boundview : 'validating-collection/bound-view',
            collectiondata : 'validating-collection/collection-data'
        },
        packages : [
            {
                name : 'underscore',
                location : 'vendor/lodash-amd/underscore'
            }
        ]
    });

    require(['underscore', 'backbone', 'boundview', 'collectiondata'],
        function (_, Backbone, BoundView, collectionData) {

            collectionData = _.map(collectionData, function(datum) {

                var ModelClass = createModelClass(datum),
                    options = _.omit(datum, 'validate');

                return new ModelClass(options);
            });

            new BoundView({
                    el : 'body',
                    collection : new Backbone.Collection(collectionData)
                })
                .render();

            function createModelClass (datum) {
                return Backbone.Model.extend({
                    validate : datum.validate
                });
            }
        });
}());
