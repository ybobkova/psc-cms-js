module.exports = function(grunt) {
  'use strict';

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
};