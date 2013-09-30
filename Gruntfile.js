/*global module:false*/
module.exports = function(grunt) {
  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.loadTasks('tasks');

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
      filter: {
        options: {
          urls: mapToUrl('tests/**/*'+grunt.option('filter')+'*.html')
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
          mainConfigFile: "lib/config.js",
          dir: "build/",

          appDir: ".",
          fileExclusionRegExp: /^(\.|node_modules|tests|\.git\\*|composer\.*|package\.json|Gruntfile.js|psc-cms-js\.*|[a-z-0-9A-Z]\.md)/,

          baseUrl: "./lib",

          paths: {
            "app/main": "empty:"
          },

          modules: [
            {
              name: "boot-helper",
              include: [
                "Psc/UI/DropBox",
                "Psc/UI/ComboDropBox",
                "Psc/UI/GridTableEditor"
              ]
            },
            {
              name: "tiptoi/Main",
              include: [
                "tiptoi/GameSimulator",
                "tiptoi/TitoGameEditor"
              ],
              exclude: [
                "boot-helper"
              ]
            },
            {
              name: "Psc/UI/CodeEditor",
              exclude: [
                "boot-helper"
              ]
            }
          ],

          findNestedDependencies: true,
          optimize: "uglify2",
          skipDirOptimize: true,
          optimizeCss: "none"
        }
      }
    },

    'find-non-AMD': {
      'default': {
        src: [
          'lib/**/*.js', '!lib/ClassTemplate.js', '!tests/testTemplate.js', '!lib/config.js',
          'vendor/**/*.js', 
            '!vendor/ace/**/*.js', 
            '!vendor/afarkas/html5*', 
            '!vendor/hogan/*', 
            '!vendor/jquery-simulate/*', 
            '!vendor/jquerypp/**',
            '!vendor/jqwidgets/globalization/**',
            '!vendor/jquery/jquery-1.8.*.js',
            '!vendor/qunit-assert/**',
            '!vendor/require*.js',
            '!vendor/lodash/**', // not quite sure either
            '!vendor/json/json2.js', // not quite sure
            '!vendor/qunit/*.js'
        ]
      }
    },

    'joose-transpile': {
      'default': {
        src: [
          'lib/Comun/**/*.js', 'lib/Psc/**/*.js', 'lib/tiptoi/**/*.js'
        ]
      }
    }
  });

  grunt.task.registerTask('default', ['jshint', 'connect:server', 'qunit:all', 'requirejs']);
  grunt.task.registerTask('server', ['connect:listenserver']);
  grunt.task.registerTask('travis', ['jshint', 'find-non-AMD', 'connect:server', 'qunit:all']);
  grunt.task.registerTask('build', ['requirejs']);
};
