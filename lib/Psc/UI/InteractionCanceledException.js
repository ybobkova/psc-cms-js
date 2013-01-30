define(['jquery', 'joose', 'Psc/UI/Exception'], function ($, Joose) {
  Joose.Class('Psc.UI.InteractionCanceledException', {
    isa: Psc.UI.Exception,

    methods: {
      toString: function () {
        return '[Psc.UI.InteractionCanceledException]';
      }
    }
  });
});