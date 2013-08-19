/*globals alert:true */
define(['jquery', 'joose', 'Psc/EventDispatching', 'Psc/Code', 'Psc/CMS/FastItem', 'Psc/UI/Dialog'], function ($, Joose) {
  /**
   * Controller for UI Elements
   * 
   * For all examples is:
   * var ui = this
   */
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

      // if attributes is a string its considered as label
      tab: function (entityName, identifier, subresource, attributes) {
        var parts = ['entities', entityName, identifier];

        if (subresource) {
          if (Psc.Code.isArray(subresource)) {
            parts = parts.concat(subresource);
          } else {
            parts.push(subresource);
          }
        }

        if (typeof(attributes) === 'string') {
          attributes = { label: attributes };
        }

        var tabAttributes = $.extend({}, {
            url: parts.join('/'),
            id: parts.join('-').replace(/@/, '-at-')
          },
          attributes
        );

        return tabAttributes;
      },

      /*
       * mode  eine bitmap: (2: draggable, 1: clickable)
       * label
       * leftIcon
       * rightIcon  der name des Buttons ohne ui-icon davor
       */
      button: function (label, mode, leftIcon, rightIcon, attributes) {
        return $.extend({}, {
          label: label,
          mode: Math.max(1, parseInt(mode, 10)),
          leftIcon: leftIcon,
          rightIcon: rightIcon
        }, attributes);
      },

      /**

       var tabButtonItem = ui.createTabButtonItem(
         ui.tab('contentstream', 59, 'form', "Seiteninhalt: Ben Guerdane (FR)"),
         ui.button("Seiteninhalt f\u00fcr FR bearbeiten", 1)
       );

       @return WidgetWrapper (is a Psc.CMS.FastItem) the attached widget is the button that opens the tab.
     */
      createTabButtonItem: function(tab, button) {
        var item = new Psc.CMS.FastItem({
          tab: tab,
          button: button
        });

        var $button = item.createButton();

        item.init($button);

        return item;
      },

      /**
       * ui.openTabsSelection("please choose one", [ui.createTabButtonItem(...), ui.createTabButtonItem(...)])
       */
      openTabsSelection: function (title, tabButtonItems, dialogAttributes) {
        var d = $.Deferred(), that = this;

        dialogAttributes = $.extend({}, {
          separator: ' ',
          closeOnSelection: true
        }, dialogAttributes);

        var dialog = new Psc.UI.Dialog(
          $.extend({}, {
            title: title,
            closeButton: "schließen",
            width: '50%',
            onCreate: function (e, dialog) {
              var html = $('<div />');

              for (var i=0; i<tabButtonItems.length; i++) {
                html.append(tabButtonItems[i].unwrap());
                html.append(dialogAttributes.separator);
              }

              dialog.setContent(html);

              if (dialogAttributes.closeOnSelection) {
                html.on('click', '.psc-cms-ui-button', function () {
                  window.setTimeout(function () {
                    dialog.close();
                  }, 300);
                });
              }
            }
          },  dialogAttributes)
        );

        

        setTimeout(function () {
          dialog.open();
          d.resolve(dialog);
        }, 10);

        return d.promise();
      },

      openTab: function (entityName, identifier, attributes, $target) {
        var d = $.Deferred(), that = this, tab;

        if (Psc.Code.isInstanceOf(entityName, Psc.UI.Tab)) {
          tab = entityName;
        } else {
          var tabAttributes = this.tab(entityName, identifier, attributes.subresource || 'form', attributes);

          if (!tabAttributes.label) { 
            throw new Error('not yet implemented: async tab loading');
          }

          tab = new Psc.UI.Tab(tabAttributes);
        }

        setTimeout(function () {  // ENHC: load label async? (thats why we prepared the api to be async)
          that.$$tabs.open(tab, $target);
          d.resolve(tab);
        }, 10);
        
        return d.promise();
      },
      openWindow: function(url, windowName) {
        var win = window.open(url, "_blank");
        
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