/*globals module:true */
module.exports = function (grunt) {
    'use strict';
    grunt.config('copy', {
        tests : {
            files : [
                {
                    expand : true,
                    cwd : 'tests/',
                    src : [
                        '**'
                    ],
                    dest : 'build/tests/'
                }
            ]
        },
        app : {
            files : [
                {
                    expand : true,
                    cwd : 'app/',
                    src : [
                        '**'
                    ],
                    dest : 'build/app/'
                }
            ]
        }
    });
};