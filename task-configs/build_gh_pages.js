/*globals module:true */
module.exports = function(grunt) {
    'use strict';
    grunt.config('build_gh_pages', {
        site : {
            options : {
                dist : 'app'
            }
        }
    });
};