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
          // include other modules that are not found with include
          mainConfigFile: "lib/boot-helper.js",
          //out: "build/psc-cms-js.min.js",
          dir: "build/",

           //The top level directory that contains your app. If this option is used
          //then it assumed your scripts are in a subdirectory under this path.
          //This option is not required. If it is not specified, then baseUrl
          //below is the anchor point for finding things. If this optio"n is specified,
          //then all the files from the app directory will be copied to the dir:
          //output area, and baseUrl will assume to be a relative path under
          //this directory.
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
            //excludeShallow

          ],

          //Finds require() dependencies inside a require() or define call. By default
          //this value is false, because those resources should be considered dynamic/runtime
          //calls. However, for some optimization scenarios, it is desirable to
          //include them in the build.
          //Introduced in 1.0.3. Previous versions incorrectly found the nested calls
          //by default.          
          findNestedDependencies: true,

          //How to optimize all the JS files in the build output directory.
          //Right now only the following values
          //are supported:
          //- "uglify": (default) uses UglifyJS to minify the code.
          //- "uglify2": in version 2.1.2+. Uses UglifyJS2.
          //- "closure": uses Google's Closure Compiler in simple optimization
          //mode to minify the code. Only available if running the optimizer using
          //Java.
          //- "closure.keepLines": Same as closure option, but keeps line returns
          //in the minified files.
          //- "none": no minification will be done.
          //optimize: "uglify2",
          optimize: "uglify2",

    //Introduced in 2.1.2: If using "dir" for an output directory, normally the
    //optimize setting is used to optimize the build bundles (the "modules"
    //section of the config) and any other JS file in the directory. However, if
    //the non-build bundle JS files will not be loaded after a build, you can
    //skip the optimization of those files, to speed up builds. Set this value
    //to true if you want to skip optimizing those other non-build bundle JS
    //files.          
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
