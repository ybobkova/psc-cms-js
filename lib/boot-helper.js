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
define(['require', './path-config'], function (require) {
  require(['jquery', 'joose', 'jquery-ui', 'Psc/UI/Main', 'Psc/UI/Tabs', 'Psc/Loader', 'Psc/Code', 'jquery-global-de-DE', 'jquery-ui-i18n'], function(nf, $, Joose) {
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
          language: lang,
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
});