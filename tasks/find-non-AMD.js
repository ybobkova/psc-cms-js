module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask("find-non-AMD", "finds all files without a define() header for AMD", function () {
    var filepaths = grunt.file.expand(grunt.util._.pluck(this.files, 'src'));
    var _ = grunt.util._;

    grunt.log.writeln('Searching in '+filepaths.length+' files.');
    var error = false;

    _.each(filepaths, function(path) {
      var code = grunt.file.read(path);

      if (!code.match(/^\s*define\(/m) && !code.match(/("|')function("|')\s*\=\=\=?\s*typeof define&&define\.amd/)) {
        grunt.log.error('File '+path+' contains not an AMD define');
        error = true;
      }

    });

    if (error) {
      grunt.log.fail();
    } else {
      grunt.log.ok();
    }
  });
};