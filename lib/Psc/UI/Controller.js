/*globals:alert*/
define(['jquery', 'joose', 'Psc/EventDispatching'], function ($, Joose) {
  Joose.Class('Psc.UI.Controller', {

    does: [Psc.EventDispatching],
    
    has: {
      tabs: { is: 'rw', required: true, isPrivate: true}
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      openTab: function (entityName, identifier, attributes, $target) {
        var d = $.Deferred(), that = this;
        
        var parts = ['entities', entityName, identifier, 'form'];
        var tabAttributes = $.extend({}, {
            url: parts.join('/'),
            id: parts.join('-').replace(/@/, '-at-')
          },
          attributes
        );
        
        if (tabAttributes.label) {
          var tab = new Psc.UI.Tab(tabAttributes);
          
          setTimeout(function () {
            // load label async?
            that.$$tabs.open(tab, $target);
            d.resolve(tab);
            
          }, 10);
        } else {
          throw new Error('not yet implemented: async tab loading');
        }
        
        return d.promise();
      },
      openWindow: function(url, windowName) {
        var win = window.open(url, windowName);
        
        if (win) {
          win.focus();
        } else {
          // @TODO schöner wäre hier ein dialog mit dem link der geöffnet werden soll
          alert('Ein Popupblocker ist aktiv. Es kann kein neues Fenster geöffnet werden');
        }
        
        return win;
      },
      toString: function () {
        return '[Psc.UI.Controller]';
      }
    }
  });
});