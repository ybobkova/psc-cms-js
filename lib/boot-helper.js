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