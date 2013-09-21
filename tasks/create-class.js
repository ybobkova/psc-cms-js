module.exports = function(grunt) {
  'use strict';

  grunt.registerTask("create-class", "crates a new Class Stub", function (className, isa, traits) {
    var _ = grunt.util._;
    grunt.log.writeln('');
    
    isa = isa === '' ? undefined : isa;
    var classParts = className.split('.');
    var ns = classParts.slice(0, -1);
    var classOnlyName = classParts.slice(-1).pop();
    var nsDir = 'lib/'+ns.join('/');
    var file = nsDir+'/'+classOnlyName+'.js';
    
    if (!grunt.file.exists(file) || grunt.cli.options.overwrite) {
      traits = _.rest(arguments, 2);
  
      var deps = _.clone(traits);
      
      if (isa) {
        deps.push(isa);
      }
      
      var jsStub = _.template(
        grunt.file.read('lib/ClassTemplate.js'), {
          _: _,
          traits: traits.join(', '),
          className: className,
          isa: isa,
          deps: _.unique(deps)
        }
      );
    
      
      if (!grunt.file.isDir(nsDir)) {
        grunt.file.mkdir(nsDir);
      }
    
      grunt.log.write('write new class to file '+file+'.. ');
      grunt.file.write(file, jsStub);
      grunt.log.ok();
            
      grunt.task.run('create-test:'+className);
      
      return;
    } else {
      grunt.log.error('will not write to existing file: '+file);
      return false;
    }
  });
};