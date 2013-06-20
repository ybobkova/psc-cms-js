define(['jquery', 'i18next', 'translations.de', 'translations.fr', 'translations.en'], function ($, i18n, de, fr, en) {

  // tree: lng -> namespace -> key -> nested key
  var resources = {
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr }
  };


  var options = {
    useCookie: false,
    resStore: resources,
    fallbackLng: 'en',
    keyseparator: '/'
  };
 
  i18n.init(options);
  $.i18n.init(options);

  return {
    setLocale: function (locale, onReady) {
      i18n.setLng(locale, onReady || function (t) {});
      $.i18n.setLng(locale, onReady || function (t) {});
    },

    getLocale: function () {
      return i18n.lng();
    },

    trans: function (key, params, domain) {
      return i18n.t(key);
    }
  };
});