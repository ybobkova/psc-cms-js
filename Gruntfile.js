/*global module:false*/
module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  var mapToUrl = function(files, baseUrl) {
    return grunt.util._.map(
      grunt.file.expandFiles(files),
      function (file) {
        return baseUrl+file;
      }
    );
  };  

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    requirejs: {
      compile: {
        options: {
          dir: "build",
          baseUrl: "lib/",
          mainConfigFile: "lib/main.js",
          
          name: "main",
          findNestedDependencies: true,
          optimize: "none",
          skipModuleInsertion: true
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'tests/**/*.js'],
      tests: ['tests/**/*.js'],
      options: {
        curly: false, /* dont blame for missing curlies around ifs */
        eqeqeq: true,
        immed: true,
        latedef: true,
        devel: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        jquery: true,
        globals: {
          $: true,
          Joose: true,
          define: true, require: true,
          
          Psc: true,
          tiptoi: true,
          CoMun: true,
          QUnit: true, module: true, stop: true, start: true, ok: true, asyncTest: true, test: true, expect: true
        }
      }
    },
    
    connect: {
      options: {
        port: 8000,
        base: '.'
      }
    },
    
    qunit: {
      all: [
        mapToUrl('tests/Psc/**/*.html', 'http://localhost:8000/'),
        mapToUrl('tests/tiptoi/**/*.html', 'http://localhost:8000/'),
        mapToUrl('tests/CoMun/**/*.html', 'http://localhost:8000/')
      ],
      dropBox: [
        mapToUrl('tests/Psc/UI/DropBox/*.html', 'http://localhost:8000/')
      ],
      options: {
        timeout: 12000,
        inject: false
      }
    },
    'update-tests': {
      options: {
      },
      src: ['tests/**/*Test.js']
    },
    concat: {
      options: {
        banner:
          '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js', 'lib/**/*.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    uglify: {
      dist: {
        src: ['dist/<%= pkg.name %>-<%= pkg.version %>.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    }
    
    /**
     * watch geht leider aus denselben gründen nicht, warum komodo nicht an den error stream rankommt
    watch: {
      tests: {
        files: '*.js',
        tasks: ['jshint']
      }
    }
    */
  });

  // Default task.
  grunt.registerTask('pack', ['jshint', 'requirejs']);
  grunt.registerTask('default', ['jshint', 'connect', 'qunit', 'requirejs']);
  grunt.registerTask('test', ['connect', 'qunit']);
  grunt.registerTask('travis', ['jshint', 'connect', 'qunit']);
  
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
  
      var deps = traits;
      
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

  grunt.registerMultiTask("update-tests", "updates the index / and singleTestFiles for all test files", function() {
    var filepaths = grunt.file.expandFiles(grunt.util._.pluck(this.files, 'src'));
    var _ = grunt.util._;
    
    // all files are relative to the grunt.js file
    grunt.log.writeln("found "+filepaths.length+" testfiles.");
    grunt.file.write(
      "tests/all.js",
      
      "/* This file was auto-generated by grunt update-tests-task on "+grunt.template.today("yyyy-mm-dd hh:mm")+" */\n"+
      "define(function () {\n"+
      "  return "+JSON.stringify(
        _.map(filepaths, function (path) { return '/'+path; }),
        undefined,
        2
      )+";\n"+
      "});\n"
    );
    
    var testCode = _.template(grunt.file.read('tests/TestTemplate.html'));
    
    // write SinlgeTests
    _.each(filepaths, function(path) {
      var htmlPath = path.replace(/^(.*?)\.js$/, "$1.html");
      var test = path.match(/^tests\/(.*?)Test\.js$/)[1];
      
      grunt.log.writeln("write single test ("+test+") File for "+path+" to "+htmlPath);
      
      grunt.file.write(htmlPath, testCode({
        testTitle: 'single test for: '+test.replace('/\/g', '.'),
        testName: test+"Test"
      }));
      
    });
    
    grunt.log.ok();
  });
};
