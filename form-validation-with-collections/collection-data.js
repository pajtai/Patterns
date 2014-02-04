define(function() {
    'use strict';
    return [
        {
            title : 'Letters',
            value : '',
            validate : function(attributes /* , options */) {
                if (! attributes.value.length) {
                    return 'required';
                }
                if (!attributes.value.match(/^[a-zA-Z]+$/)) {
                    return 'not all letters';
                }
                return undefined;
            }
        },
        {
            title : 'Numbers',
            value : '',
            validate : function(attributes /* , options */) {
                if (! attributes.value.length) {
                    return 'required';
                }

                if (!attributes.value.match(/^[0-9]+$/)) {
                    return 'not all numbers';
                }
                return undefined;
            }
        },
        {
            title : '8 characters',
            value : '',
            validate : function(attributes /* , options */) {
                if (! attributes.value.length) {
                    return 'required';
                }

                if (attributes.value.length < 8) {
                    return 'too short';
                }
                return undefined;
            }
        }
    ];
});