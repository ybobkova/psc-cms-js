define(['jquery', 'joose', 'Psc/Exception'], function ($, Joose) {
  Joose.Class('Psc.UI.Exception', {
    isa: Psc.Exception,

    methods: {
      toString: function () {
        return '[Psc.UI.Exception]';
      }
    }
  });
});