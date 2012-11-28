define(['jquery', 'joose', 'Psc/EventDispatching'], function ($) {
  Joose.Class('Psc.UI.Controller', {

    does: [Psc.EventDispatching],
    
    has: {
      //propertyName: { is: 'rw', required: true, isPrivate: true},
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      toString: function () {
        return '[Psc.UI.Controller]';
      }
    }
  });
});