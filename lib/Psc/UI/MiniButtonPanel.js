define(['jquery', 'joose'], function ($) {
  Joose.Class('Psc.UI.MiniButtonPanel', {

    has: {
      buttons: { is: 'rw', required: true, isPrivate: true},
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      toString: function () {
        return '[Psc.UI.MiniButtonPanel]';
      }
    }
  });
});