module.exports = function(grunt) {
  'use strict';

  grunt.task.registerTask('test', "runs the test with a temporary server", function () {
    var tasks = ['connect:server']; 
    if (grunt.option('filter')) {
      tasks.push('qunit:filter');
    } else {
      tasks.push('qunit:all');
    }
    
    grunt.task.run(tasks);
  });
};