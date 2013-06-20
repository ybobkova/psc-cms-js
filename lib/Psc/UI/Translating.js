define(['joose', 'jquery'], function(Joose) {
  // translator must be loaded!
  Joose.Role('Psc.UI.Translating', {

    methods: {
      trans: function (key, params) {
        return $.i18n.t(key, params);
      },
      transf: function (key, vars) {
        return $.i18n.t(
          key, 
          { 
            postProcess: 'sprintf', 
            sprintf: vars 
          }
        );
      },

      getLocale: function () {
        return $.i18n.lng();
      }
    }
  });
});