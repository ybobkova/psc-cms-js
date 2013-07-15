/*global module:false*/
module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
//  grunt.loadNpmTasks('grunt-contrib-concat');
//  grunt.loadNpmTasks('grunt-contrib-uglify');
//  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-hogan');
  grunt.loadNpmTasks('grunt-webpack');

  var port = 8000;
  var hostname = 'localhost';
  var nodepath = require("path");
  
  var mapToUrl = function(files) {
    var baseUrl = 'http://'+hostname+':'+port+'/';
    
    var urls = grunt.util._.map(
      grunt.file.expand(files),
      function (file) {
        return baseUrl+file;
      }
    );
    
    return urls;
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'lib/**/*.js', '!lib/ClassTemplate.js', 'tests/**/*.js', '!tests/testTemplate.js'],
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
          define: true, require: true,

          Psc: true,
          tiptoi: true,
          CoMun: true,
          QUnit: true, module: true, stop: true, start: true, ok: true, asyncTest: true, test: true, expect: true
        }
      }
    },
    
    qunit: {
      all: {
        options: {
           urls: [].concat(mapToUrl('tests/Psc/**/*.html'))
                   .concat(mapToUrl('tests/tiptoi/**/*.html'))
                   .concat(mapToUrl('tests/CoMun/**/*.html'))
        }
      },
      nav: {
        options: {
          urls: mapToUrl('tests/Psc/UI/Navigation*.html')
        }
      },
      dropBox: {
        options: {
          urls: mapToUrl('tests/Psc/UI/DropBox/*.html')
        }
      },
      textParser: {
        options: {
          urls: mapToUrl('tests/Psc/TextParser*.html')
        }
      },
      textEditor: {
        options: {
          urls: mapToUrl('tests/Psc/TextEditor*.html')
        }
      },
      date: {
        options: {
          urls: mapToUrl('tests/Psc/Date*.html')
        }
      },
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
    },
    
    hogan: {
      'amd': {
        binderName : "amd",
        templates : "./templates/src/**/*.mustache",
        output : "./templates/compiled.js",
        nameFunc: function(fileName) {
          fileName = nodepath.normalize(fileName);
          
          var pathParts = fileName.split(nodepath.sep).slice(['templates', 'src'].length, -1);
          var namespace = pathParts.length > 0 ? pathParts.join('.')+'.' : '';
        
          var templateName = namespace+nodepath.basename(fileName, nodepath.extname(fileName));
          return templateName;
        }
      }
    },
    
    /**
     * watch geht leider aus denselben gründen nicht, warum komodo nicht an den error stream rankommt
    watch: {
      tests: {
        files: '*.js',
        tasks: ['jshint']
      }
    }
    */
    connect: {
      server: {
        options: {
          hostname: hostname,
          port: port,
          base: '.'
        }
      },
      listenserver: {
        options: {
          hostname: hostname,
          port: port,
          base: '.',
          keepalive: true
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "lib",
          mainConfigFile: "lib/boot-helper.js",
          out: "build/psc-cms-js.min.js",

          name: "main",
          /*
          
          findNestedDependencies: true,
          */
          optimize: "none"
        }
      }
    },

    webpack: {
      options: {},
      someName: {
        entry: "./lib/boot-helper.js",
        output: {
          path: "build/",
          filename: "[hash].js",
          libraryTarget: "umd"
        },

        resolve: {
          root: './lib/',
          alias: {
    'jquery': "../vendor/jquery/jquery-1.8.2",
    'jquery-ui': "../vendor/jquery-ui/jquery-ui-1.8.24.custom.patched",
    'jquery-ui-i18n': "../vendor/jquery-ui/jquery-ui-i18n.custom",
    "qunit": "../vendor/qunit/qunit-1.10.0",
    'joose': "../vendor/joose/all",
    'ace': "../vendor/ace/lib/ace",
    'lodash': "../vendor/lodash/lodash-0.10.0.min",
    'psc-tests-assert': '../vendor/qunit-assert/lib/assert',
    'qunit-assert': '../vendor/qunit-assert/lib/assert',
    'TestRunner': "../vendor/qunit-assert/lib/TestRunner",
    'img-files': '../img',
    'jquery-form': "../vendor/jquery-form/jquery.form-3.20",
    'jquery-fileupload': "../vendor/jquery-fileupload/jquery.fileupload",
    'jquery-iframe-transport': "../vendor/jquery-fileupload/jquery.iframe-transport",
    'jquery.ui.widget': "../vendor/jquery-fileupload/vendor/jquery.ui.widget",
    'jquery-tmpl': "../vendor/jquery-tmpl/jquery.tmpl",
    'jqwidgets': "../vendor/jqwidgets/jqx-all.min",
    'jquery-simulate': "../vendor/jquery-simulate/jquery.simulate.patched",
    'jquery-rangyinputs': "../vendor/jquery-rangyinputs/rangyinputs_jquery.min",
    'jquerypp': "../vendor/jquerypp/1.0.0/amd/jquerypp",
    'ui-connect-morphable': "../vendor/webforge/jquery.ui.connect-morphable",
    'ui-paging': "../vendor/webforge/ui.paging",
    "JSON": "../vendor/json/json2",
    "hogan": "../vendor/hogan/hogan-2.0.0.min.amd",
    'placeholder': "../vendor/mths.be/placeholder-2.0.6",
    'stacktrace': "../vendor/eriwen/stacktrace-min-0.4",
    'twitter-bootstrap': "../vendor/twitter-bootstrap/bootstrap",
    'twitter-typeahead': "../vendor/twitter/typeahead/typeahead.min",
    'knockout': "../vendor/knockout/knockout-2.2.1",
    'knockout-mapping': "../vendor/knockout/knockout.mapping",
    'test-files': "../tests/files",
    'knockout-bindings': "lib/Psc/ko/bindings",
    'jquery-selectrange': "../vendor/stackoverflow/jquery-selectrange",
    'jquery-global': "../vendor/jqwidgets/globalization/jquery.global",
    'jquery-global-de-DE': "../vendor/jqwidgets/globalization/jquery.glob.de-DE",
    'templates': "../templates",
    'html5shiv': "../vendor/afarkas/html5shiv",
    'i18next': '../vendor/i18next/i18next.amd.withJQuery-1.6.3.min'

          }
        },

        stats: {
      // Configure the console output
          colors: true,
          modules: true,
          reasons: true
        },

        //storeStatsTo: "xyz", // writes the status to a variable named xyz
        // you may use it later in grunt i.e. <%= xyz.hash %>

        failOnError: true // don't report error to grunt if webpack find errors
        // Use this if webpack errors are tolerable and grunt should continue
      }
    }
  });

  grunt.task.registerTask('pack', ['jshint', 'requirejs']);
  grunt.task.registerTask('default', ['jshint', 'connect:server', 'qunit:all', 'requirejs']);
  grunt.task.registerTask('test', ['connect:server', 'qunit:all']);
  grunt.task.registerTask('server', ['connect:listenserver']);
  grunt.task.registerTask('travis', ['jshint', 'connect:server', 'qunit:all']);
  
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
    var filepaths = grunt.file.expand(grunt.util._.pluck(this.files, 'src'));
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
