module.exports = function(grunt) {
  'use strict';

  grunt.registerTask("create-test", "crates a new Test Stub for a class", function (className) {
    var _ = grunt.util._;
    grunt.log.writeln('');
    
    var classParts = className.split('.');
    var ns = classParts.slice(0, -1);
    var classOnlyName = classParts.slice(-1).pop();
    var nsDir = 'tests/'+ns.join('/');
    var file = nsDir+'/'+classOnlyName+'Test.js';
    
    if (!grunt.file.exists(file) || grunt.cli.options.overwrite) {
      var jsStub = _.template(
        grunt.file.read('tests/testTemplate.js'), {
          className: className,
          scClass: classOnlyName.substring(0,1).toLowerCase()+classOnlyName.substr(1)
        }
      );
      
      if (!grunt.file.isDir(nsDir)) {
        grunt.file.mkdir(nsDir);
      }
    
      grunt.log.write('write new test to file '+file+'.. ');
      grunt.file.write(file, jsStub);
      grunt.log.ok();
      
      return;
    } else {
      grunt.log.error('will not write to existing file: '+file);
      return false;
    }
  });
};