/*
 * the production file for bootstrapping the libraries from psc-cms-js
 *
 * in your local project:
 * create a file in your javascripts-directory (lets say its: /js) named boot.js and insert the contents:
 *
 * requirejs.config({
 *    // set baseUrl to the path to the lib directory of the psc-cms-js repository (this dir)
 *    baseUrl: "/psc-cms-js/lib/"
 * });
 *
 * // unfortunately we cannot name it also "boot" because then in the
 * define(['boot-helper', 'require'], function (boot, require) {
 *   // only use the nested require for libraries like jquery, vendors, etc,
 *   // because boot has to be loaded at first to set requirejs.config for the paths to vendor, etc
 *   // require(['js/other/project/dependency', 'jquery', 'Psc/UI/Main'], function (dependency, jQuery) {
 *         // load something with the dependency and jQuery here
 *
 *         // for example you could create a Psc.UI.Main here: (Psc/UI/Main loads it globally beforehand), Joose is loaded from boot globally
 *         new Psc.UI.Main({
 *           tabs: $(..),
 *
 *           // in boot.getLoader() all inline scripts are already appended.
 *           // load them with: $.when(boot.getLoader().finished()).then(function () {... });
 *           loader: boot.getLoader()
 *         });
 *      });
 *
 *   // inject something to boot, etc, if you can load your main synchronously
 *   // to provide the inline scripts with main loaded asyncronously you should do something deferred
 *
 *   return boot;
 * });
 *
 *   boot is a simple object with function .getLoader() which returns a Psc.Loader which can be used for inline scripts with:
 *   <script type="text/javascript">
 *     require(['boot'], function (boot) {
 *       boot.getLoader().onRequire(['my/dependency1'], function (dependency1) {
 *         // do something here
 *       });
 *     });
 *   </script>
 *
 */

/* global requirejs */

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
    'twitter-bootstrap': "../vendor/twitter-bootstrap/bootstrap.min",
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
    'i18next': '../vendor/i18next/i18next.amd.withJQuery-1.6.3.min',
    'gdl/master/common/ispy': 'empty-module'
  }
});

define(function() {
  return {
  
  };

});