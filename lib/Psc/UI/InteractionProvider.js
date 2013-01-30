/*globals confirm prompt*/
define(['jquery', 'joose', 'Psc/UI/InteractionProviding'], function ($, Joose) {
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
        var value = this._doPrompt(message, defaultValue);
        
        if (value === null) { // seems to be working in ie 9, firefox and chrome
          throw new Psc.UI.InteractionCanceledException('Interaction Canceled for message:'+message);
        }
        
        return value;
      },
      _doPrompt: function(message, defaultValue) {
        return prompt(message, defaultValue !== undefined ? defaultValue : '');
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