define(['backbone', 'underscore', 'jquery'], function(Backbone, _, $) {
    'use strict';
    return Backbone.View.extend({
        initialize : initialize,
        render : render
    });

    function initialize(options) {
        var self = this;

        _.each(options.collection.models, function(model) {
            var $div = $('<div>'),
                $label = $('<label>' + model.get('title') + '</label>'),
                $input = $('<input value=""/>'),
                $error = $('<span></span>');
            model.isValid();
            $input.on('change', _onInputChanged.bind(self, model, $input));
            model.on('invalid', function() {
                $error.text(arguments[1]);
            });
            model.on('change', $error.text.bind($error, ''));
            self.$el.append($div.append($label).append($input).append($error));
        });
        this.$button = $('<div>Invalid</div>');
        this.$button.appendTo(this.$el);
        this.listenTo(this.collection, 'change invalid', _onModelsChanged);
    }

    function render() {
        this.$el.append(this.$template);
    }

    function _onInputChanged(model, $input) {
        var val = $input.val();
        if ('' === val) {
            model.set('value', $input.val());
            model.isValid();
        } else {
            model.set('value', $input.val(), {validate : true});
        }
    }

    function _onModelsChanged() {
        if (_.all(this.collection.models, function(model) {
            return !model.validationError;
        })) {
            this.$button.text('Valid');
        } else {
            this.$button.text('Invalid');
        }
    }
});