/*globals confirm prompt*/
define(['jquery', 'joose', 'Psc/UI/InteractionProviding'], function ($) {
  Joose.Class('Psc.UI.InteractionProvider', {
    has: {
      //propertyName: { is: 'rw', required: true, isPrivate: true},
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      prompt: function (message, defaultValue) {
        return prompt(message, defaultValue);
      },
      confirm: function(message) {
        return confirm(message);
      },
      toString: function () {
        return '[Psc.UI.InteractionProvider]';
      }
    }
  });
});