/*globals requirejs*/
define(function () {

  requirejs.config({
    /* set paths and vendor versions for applications
     *
     * paths are relative to lib
     * define all vendor dependencies here
     */
    paths: {
      'jquery': "../vendor/jquery/jquery-1.8.2",
      'jquery-ui': "../vendor/jquery-ui/jquery-ui-1.8.24.custom.patched",
      'jquery-ui-i18n': "../vendor/jquery-ui/jquery-ui-i18n.custom",
      "qunit": "../vendor/qunit/qunit-1.10.0",
      'joose': "../vendor/joose/all",
      'ace': "../vendor/ace/lib/ace",
      'lodash': "../vendor/lodash/lodash-0.10.0.min",
      'psc-tests-assert': '../tests/assert',
      'test-files': '../tests/files',
      'img-files': '../img',
      'jquery-form': "../vendor/jquery-form/jquery.form-3.20",
      'jquery-fileupload': "../vendor/jquery-fileupload/jquery.fileupload",
      'jquery-iframe-transport': "../vendor/jquery-fileupload/jquery.iframe-transport",
      'jquery.ui.widget': "../vendor/jquery-fileupload/vendor/jquery.ui.widget",
      'jquery-tmpl': "../vendor/jquery-tmpl/jquery.tmpl",
      'jqwidgets': "../vendor/jqwidgets/jqx-all.min",
      'jquery-simulate': "../vendor/jquery-simulate/jquery.simulate.patched",
      'jquerypp': "../vendor/jquerypp/1.0.0/amd/jquerypp",
      'ui-connect-morphable': "../vendor/webforge/jquery.ui.connect-morphable",
      'ui-paging': "../vendor/webforge/ui.paging",
      "JSON": "../vendor/json/json2",
      "hogan": "../vendor/hogan/hogan-2.0.0.min.amd",
      'placeholder': "../vendor/mths.be/placeholder-2.0.6",
      'stacktrace': "../vendor/eriwen/stacktrace-min-0.4",
      'twitter-bootstrap': "../vendor/twitter-bootstrap/bootstrap",
      'twitter-typeahead': "../vendor/twitter/typeahead/typeahead",
      'knockout': "../vendor/knockout/knockout-2.2.1",
      'knockout-bindings': "lib/Psc/ko/bindings",
      'jquery-selectrange': "../vendor/stackoverflow/jquery-selectrange",
      'jquery-global': "../vendor/jqwidgets/globalization/jquery.global",
      'jquery-global-de-DE': "../vendor/jqwidgets/globalization/jquery.glob.de-DE",
      'templates': "../templates",
      'html5shiv': "../vendor/afarkas/html5shiv"
    }
  });
});