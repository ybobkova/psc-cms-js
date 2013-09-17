/*global module:false*/
module.exports = function(grunt) {
  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

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
      tabs: {
        options: {
          urls: mapToUrl('tests/Psc/UI/Tabs*.html')
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
  grunt.task.registerTask('test', ['connect:server', 'qunit:all']);
  grunt.task.registerTask('server', ['connect:listenserver']);
  grunt.task.registerTask('travis', ['jshint', 'find-non-AMD', 'connect:server', 'qunit:all']);
  grunt.task.registerTask('build', ['requirejs']);

  grunt.task.registerTask('publish', "prepares the relase and publishes with npm", function () {
    var that = this;
    var exec = require('child_process').exec;
    var npm = require('npm');
    var process = require('process');

    if (!process.env.TRAVIS_SECURE_ENV_VARS || process.env.TRAVIS_SECURE_ENV_VARS === 'false') {
      grunt.log.ok('Will not do something when secure vars are not set. (Travis Pull Request)');
      return 0;
    }

    var npmconfig = {
      username: process.env.NPM_USERNAME,
      password: process.env.NPM_PASSWORD,
      email: process.env.NPM_EMAIL
    };

    var semver = require('semver');

    var parseBaseVersion = function (pkg) {
      var devRange = new semver.Range(pkg.config['branch-alias']['dev-master'], true); // @todo dev-{{branch}}
      baseVersion = devRange.set[0][0].semver;
      baseVersion.prerelease = [];
      baseVersion.build = [];
      baseVersion.format();

      return baseVersion;
    };

    var parseNpmTag = function (pkg, baseVersion) {
      return baseVersion.major+'.'+baseVersion.minor+'.x-dev';
    };

    var file = "package.json", toFile = "build/package.json";
    var pkg = grunt.file.readJSON(file);
    var gitVersion, baseVersion = parseBaseVersion(pkg), npmTag = parseNpmTag(pkg, baseVersion);

    var done = this.async();

    grunt.util.spawn({
      cmd: 'git',
      args: ['rev-parse', '--short', 'HEAD']
      //args: ['describe', '--tags', '--always', '--abbrev=1']
    }, function (error, result, code) {
      if (error) {
        grunt.fatal('Can not get a version number using `git describe` '+error);
      } else {
        gitVersion = result.stdout;
      }

      var bumped = false;
      var VERSION_REGEXP = /([\'|\"]version[\'|\"][ ]*:[ ]*[\'|\"])([\d||A-a|.|-]*)([\'|\"])/i;
      var content = grunt.file.read(file).replace(VERSION_REGEXP, function(match, prefix, parsedVersion, suffix) {
        bumped = true;
        return prefix + baseVersion+'-'+gitVersion + suffix;
      });

      if (!bumped) {
        grunt.fatal('Cannot find version in file: '+file);
      }

      grunt.file.write(toFile, content);

      var pkg = grunt.file.readJSON(toFile);
      grunt.log.writeln('Version bumped to '+pkg.version+' (in '+toFile+'). Will tag with: '+npmTag);

      npm.load({}, function(err) {
        npm.registry.adduser(npmconfig.username, npmconfig.password, npmconfig.email, function(err) {
          grunt.log.writeln('Logged in as: '+npmconfig.username+' ('+npmconfig.email+')');

          if (err) {
            grunt.log.error(err);
            done(false);
          } else {
            npm.config.set("email", npmconfig.email, "user");
            npm.config.set("tag", npmTag, "user");

            npm.commands.publish(["build"], function(err) {
              if (err) {
                grunt.log.err(err);
                done(false);
              } else {
                grunt.log.ok('published to npm registry');
                done(true);
              }
            });
          }
        });
      });
    });

    // version = gitVersion || semver.inc(parsedVersion, versionType || 'patch');

  });
  
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
