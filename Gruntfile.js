/*globals module:true */
module.exports = function (grunt) {
    'use strict';
    var path = require('path'),
        _ = grunt.util._;
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json')
    });

    grunt.loadTasks('task-configs');
    grunt.registerTask('server', 'Build and watch task', [
        'jshint', 'connect:site',  'open:reload', 'watch'
    ]);
    // To start editing your slideshow using livereload, run 'grunt server'
    grunt.registerTask('test', 'Build and watch task', [
        'jshint', 'connect:tests',  'open:masseuse', 'watch'
    ]);
    grunt.registerTask('deploy', ['clean:build', 'copy:app', 'build_gh_pages']);
};
