/*globals requirejs*/
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

requirejs.config({
  
  /* set paths and vendor versions for applications
   * 
   * paths are relative to lib
   * define all vendor dependencies here
   */
  paths: {
    'jquery': "../vendor/jquery/jquery-1.8.2",
    'jquery-ui': "../vendor/jquery-ui/jquery-ui-1.8.24.custom.patched",
    'jquery.ui.widget': "../vendor/jquery-ui/jquery-ui-1.8.24.custom.patched",
    'jquery-ui-i18n': "../vendor/jquery-ui/jquery-ui-i18n.custom",
    "qunit": "../vendor/qunit/qunit-1.10.0",
    'joose': "../vendor/joose/all",
    'ace': "../vendor/ace/lib/ace",
    'psc-tests-assert': '../tests/assert',
    'jquery-form': "../vendor/jquery-form/jquery.form-3.02",
    'jquery-fileupload': "../vendor/jquery-fileupload/jquery.fileupload",
    'jquery-tmpl': "../vendor/jquery-tmpl/jquery.tmpl",
    'jqwidgets': "../vendor/jqwidgets/jqx-all",
    'jqwidgets-global': "../vendor/jqwidgets/globalization/jquery.global",
    'jquery-simulate': "../vendor/jquery-simulate/jquery.simulate",
    'ui-connect-morphable': "../vendor/webforge/jquery.ui.connect-morphable",
    'ui-paging': "../vendor/webforge/ui.paging",
    "JSON": "../vendor/json/json2",
    'placeholder': "../vendor/mths.be/placeholder-2.0.6"
  }
});

define(['jquery', 'joose', 'jquery-ui', 'Psc/UI/Main', 'Psc/UI/Tabs', 'Psc/Loader', 'Psc/Code'], function ($) {
  var loader = new Psc.Loader();
  
  return {
    getLoader: function () {
      return loader;
    },
    createMain: function ($cmsContent) {
      var main;
      if ($cmsContent.length) {
        var $tabs = $cmsContent.find('div.psc-cms-ui-tabs:eq(0)'); // das erste tabs objekt wird unser main tab
        
        main = new Psc.UI.Main({
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