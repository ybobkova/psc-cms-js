requirejs.config({
  
  baseUrl: "/lib",
  
  paths: {
    fixtures: "../tests/files",
    tests: "../tests",
    "js/main": "../tests/ui-main-bootstrap",
  
    /* paths are relative to lib */
    'jquery': "../vendor/jquery/jquery-1.8.2",
    'jquery-ui': "../vendor/jquery-ui/jquery-ui-1.8.22.custom.patched",
    'jquery-ui-i18n': "../vendor/jquery-ui/jquery-ui-i18n.custom",
    "qunit": "../vendor/qunit/qunit-1.10.0",
    'joose': "../vendor/joose/all",
    'ace-editor': "../vendor/ace/ace",
    'psc-tests-assert': '../tests/assert',
    'jquery-form': "../vendor/jquery-form/jquery.form-3.02",
    'jquery-tmpl': "../vendor/jquery-tmpl/jquery.tmpl",
    'jqwidgets': "../vendor/jqwidgets/jqx-all",
    'jqwidgets-global': "../vendor/jqwidgets/globalization/jquery.global",
    'jquery-simulate': "../vendor/jquery-simulate/jquery.simulate",
    'ui-paging': "../vendor/webforge/ui.paging"
  }
});

define(['js/main'], function (main) {
  
  window.requireLoad = function(requirements, payload) {
    requirements.unshift('js/main');
    main.getLoader().onRequire(requirements, payload);
  };
  
});