/*
 * ui-main
 *
 * the production file for bootstrapping an Psc.UI.Main with tabs for the current document
 *
 * create a file js/main.js and insert the contents:
 *
 * requirejs.config({
 *    // set baseUrl to the path to the lib directory of the psc-cms-js repository
 *    baseUrl: "/psc-cms-js/lib/" 
 * });
 *
 * define(['require', 'ui-main'], function (require, main) {
 *   // only use the nested require, because ui-main has to be loaded at first to set requirejs.config for the paths to vendor, etc
 *   // require(['js/other/project/dependency', 'jquery']);
 * 
 *   // inject something to main, etc
 *   // you can return your own main here, etc
 *   
 *   
 *   return main; // is an instanceof Psc.UI.Main
 * });
 */
requirejs.config({
  
  /* paths are relative to lib
   *
   * define all vendor dependencies here
   */
  paths: {
    'jquery': "../vendor/jquery/jquery-1.8.2",
    'jquery-ui': "../vendor/jquery-ui/jquery-ui-1.8.24.custom.patched",
    'jquery.ui.widget': "../vendor/jquery-ui/jquery-ui-1.8.24.custom.patched",
    'jquery-ui-i18n': "../vendor/jquery-ui/jquery-ui-i18n.custom",
    "qunit": "../vendor/qunit/qunit-1.10.0",
    'joose': "../vendor/joose/all",
    'ace': "../vendor/ace",
    'psc-tests-assert': '../tests/assert',
    'jquery-form': "../vendor/jquery-form/jquery.form-3.02",
    'jquery-fileupload': "../vendor/jquery-fileupload/jquery.fileupload",
    'jquery-tmpl': "../vendor/jquery-tmpl/jquery.tmpl",
    'jqwidgets': "../vendor/jqwidgets/jqx-all",
    'jqwidgets-global': "../vendor/jqwidgets/globalization/jquery.global",
    'jquery-simulate': "../vendor/jquery-simulate/jquery.simulate",
    'ui-connect-morphable': "../vendor/webforge/jquery.ui.connect-morphable",
    'ui-paging': "../vendor/webforge/ui.paging",
    "JSON": "../vendor/json/json2"
  }
});

define(['jquery', 'joose', 'jquery-ui', 'Psc/UI/Main', 'Psc/UI/Tabs', 'Psc/Code'], function ($) {
  var $cmsContent = $('#content');
  
  if ($cmsContent.length) {
    var $tabs = $cmsContent.find('div.psc-cms-ui-tabs:eq(0)'); // das erste tabs objekt wird unser main tab
    var main = new Psc.UI.Main({
      tabs: new Psc.UI.Tabs({
        widget: $tabs
      })
    });
  
    main.attachHandlers();
    main.getEventManager().setLogging(true);

    window.requireLoad = function(requirements, payload) {
      requirements.unshift('js/main');
      main.getLoader().onRequire(requirements, payload);
    };
    
    return main;
  }
});