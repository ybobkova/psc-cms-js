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
  paths: {
    "test-files": "../tests/files",
    "img-files": "../img",
    templates: "../templates",

    jquery: "..\\bower_components\\jquery\\jquery.min",
    "jquery-ui": "../vendor/jquery-ui/jquery-ui-1.8.24.custom.patched",
    "jquery-ui-i18n": "../vendor/jquery-ui/jquery-ui-i18n.custom",
    qunit: "../vendor/qunit/qunit-1.10.0",
    joose: "../vendor/joose/all",
    ace: "../vendor/ace/lib/ace",
    lodash: "..\\bower_components\\lodash\\dist\\lodash.compat",
    "psc-tests-assert": "../vendor/qunit-assert/lib/assert",
    "qunit-assert": "../vendor/qunit-assert/lib/assert",
    TestRunner: "../vendor/qunit-assert/lib/TestRunner",
    "jquery-form": "..\\bower_components\\jquery-form\\jquery.form",
    "jquery-tmpl": "../vendor/jquery-tmpl/jquery.tmpl",
    jqwidgets: "../vendor/jqwidgets/jqx-all.min",
    "jquery-simulate": "../vendor/jquery-simulate/jquery.simulate.patched",
    "jquery-rangyinputs": "../vendor/jquery-rangyinputs/rangyinputs_jquery.min",
    jquerypp: "..\\bower_components\\jquerypp",
    "ui-connect-morphable": "../vendor/webforge/jquery.ui.connect-morphable",
    "ui-paging": "../vendor/webforge/ui.paging",
    JSON: "..\\bower_components\\json3\\build",
    hogan: "..\\bower_components\\hogan\\lib\\hogan",
    "placeholder": "..\\bower_components\\jquery-placeholder\\jquery.placeholder",
    stacktrace: "..\\bower_components\\stacktrace\\stacktrace",
    "twitter-bootstrap": "../vendor/twitter-bootstrap/bootstrap",
    "twitter-typeahead": "../vendor/twitter/typeahead/typeahead.min",
    knockout: "..\\bower_components\\knockout\\knockout",
    "knockout-mapping": "..\\bower_components\\knockout-mapping\\knockout.mapping",
    "knockout-bindings": "lib/Psc/ko/bindings",
    "jquery-global": "../vendor/jqwidgets/globalization/jquery.global",
    "jquery-global-de-DE": "../vendor/jqwidgets/globalization/jquery.glob.de-DE",
    html5shiv: "..\\bower_components\\html5shiv\\html5shiv",
    i18next: "..\\bower_components\\i18next\\release\\i18next.amd.withJQuery-1.6.3.min",
    "jquery.ui.widget": "..\\bower_components\\jquery-file-upload\\js\\vendor\\jquery.ui.widget",
    "jquery-fileupload": "..\\bower_components\\jquery-file-upload\\jquery.fileupload",
    "jquery-iframe-transport": "..\\bower_components\\jquery-file-upload\\js\\jquery.iframe-transport",
    "blueimp-canvas-to-blob": "..\\bower_components\\blueimp-canvas-to-blob\\js\\canvas-to-blob",
    "blueimp-tmpl": "..\\bower_components\\blueimp-tmpl\\js\\tmpl",
    "load-image": "..\\bower_components\\blueimp-load-image\\js\\load-image",
    "load-image-ios": "..\\bower_components\\blueimp-load-image\\js\\load-image-ios",
    "load-image-orientation": "..\\bower_components\\blueimp-load-image\\js\\load-image-orientation",
    "load-image-meta": "..\\bower_components\\blueimp-load-image\\js\\load-image-meta",
    "load-image-exif": "..\\bower_components\\blueimp-load-image\\js\\load-image-exif",
    "load-image-exif-map": "..\\bower_components\\blueimp-load-image\\js\\load-image-exif-map"
  }
});

define(['jquery', 'joose', 'jquery-ui', 'Psc/UI/Main', 'Psc/UI/Tabs', 'Psc/Loader', 'Psc/Code', 'jquery-global-de-DE'], function($, Joose) {
  var loader = new Psc.Loader();

  return {
    getLoader: function() {
      return loader;
    },
    createMain: function($cmsContent) {
      var main;
      if ($cmsContent.length) {
        var $tabs = $cmsContent.find('div.psc-cms-ui-tabs:eq(0)'); // das erste tabs objekt wird unser main tab

        // set language from html
        var lang = $('html head meta[name="content-language"]').attr('content');
        $.global.preferCulture(lang);

        if (lang !== 'en') {
          $.datepicker.setDefaults($.datepicker.regional[lang]);
        }

        main = new Psc.UI.Main({
          locale: lang,
          tabs: new Psc.UI.Tabs({
            widget: $tabs
          }),
          loader: loader
        });

        main.attachHandlers();
        main.getEventManager().setLogging(true);

        window.requireLoad = function(requirements, payload) {
          requirements.unshift('app/main');
          main.getLoader().onRequire(requirements, payload);
        };
      }

      return main;
    }
  };
});