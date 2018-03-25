/**
 * Grunt configuration
 */
"use strict";

module.exports = function(grunt) {

    // We need to include the core Moodle grunt file too, otherwise we can't run tasks like "amd".
    require("grunt-load-gruntfile")(grunt);
    grunt.loadGruntfile("../../Gruntfile.js");

    // The default task (running "grunt" in console).
    grunt.registerTask("default", ["eslint:amd", "uglify"]);
};