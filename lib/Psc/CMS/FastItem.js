define(['joose', 'Psc/Code','Psc/Request','Psc/UI/Tab','Psc/UI/WidgetWrapper', 'Psc/UI/Button', 'Psc/UI/DropBoxButton'], function(Joose) {
  Joose.Class('Psc.CMS.FastItem', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.UI.DropBoxButton],
      
    has: {
      
      // widget is NOT required
      widget: { is : 'rw', required: false, isPrivate: false },
      
      // RightContentLinkable
      
      // buttonable
      /**
       * button.label
       * button.fullLabel
       * button.mode  eine bitmap: (2: draggable, 1: clickable)
       * button.leftIcon
       * button.rightIcon  der name des Buttons ohne ui-icon davor
       */
      button: { is : 'rw', required: false, isPrivate: true },
      fullLabeled: { is : 'rw', required: false, isPrivate: true, init: false }, // helper für den state
      
      // identifyable
      identifier: { is : 'rw', required: false, isPrivate: true },
      entityName: { is : 'rw', required: false, isPrivate: true },
      // notice: buttons are not necessarly identifyable!
  
  
      // deletable
      /**
       * delete.url
       * delete.method
       */
      'delete': { is : 'rw', required: false, isPrivate: true },
  
      // autocompletable
      /**
       * ac.label
       */
      ac: { is : 'rw', required: false, isPrivate: true },
      
      // tabopenable
      /**
       * tab.label
       * tab.url
       * tab.id
       *
       * dieser Output kann mit Psc\CMS\Item\Exporter::tabOpenable() erzeugt werden
       */
      tab: { is : 'rw', required: false, isPrivate: true }
      
    },
    
    after: {
      initialize: function (props) {
        if (props.widget) {
          this.init(props.widget);
        }
      }
    },
  
    methods: {
      init: function($widget) {
        this.setWidget($widget);
        this.checkWidget();
        this.linkWidget();
  
        if (this.$$button.mode & 2) {
          this.initDraggable();
        }
        
        if (this.$$button.mode & 1) {
          this.initClickable();
        }
        
        this.initLabelFlippable(this.unwrap());        
      },
      
      // buttonable
      initDraggable: function () {
        var options = {
          start: function (e, ui) {
            Psc.Code.info('start dragging draggable', ui);
            var $widget = $(this);
            return true;
          },
          cancel: false,
          revert: false,
          helper: 'clone',
          scroll: 'true',
          scrollSpeed: 40,
          appendTo: 'body',
          distance: 20 // damit man nicht beim klicken aus versehen dragged
        };
        
        this.unwrap().draggable(options);
      },
      initClickable: function () {
        if (this.$$tab) {
          this.unwrap().addClass('psc-cms-ui-tab-button-openable'); // weiter gehts in main on click
        }
      },
      
      createButton: function () {
        var button = new Psc.UI.Button(this.$$button);
        
        return button.create();
      },
  
      initLabelFlippable: function ($button) {
        var that = this;
        if (this.$$button.fullLabel && this.$$button.fullLabel !== this.$$button.label) {
          $button.click(function (e) {
            /* morph label into full label or vice versa */
            if (e.ctrlKey) {
              e.preventDefault();
              e.stopPropagation();
              var fin = 600, fout = 400;
              
              if (!that.getFullLabeled()) {
                $button.fadeOut(fout,'easeInOutExpo', function () {
                  $button.button('option', 'label',  that.getButton().fullLabel);
                  $button.fadeIn(fin);
                  that.setFullLabeled(true);
                });
              } else {
                $button.fadeOut(fout, 'easeInOutExpo', function () {
                  $button.button('option', 'label', that.getButton().label);
                  $button.fadeIn(fin);
                  that.setFullLabeled(false);
                });
              }
            }
          });
        }
      },
      
      // identifyable
      getIdentifier: function() {
        return this.$$identifier;
      },
      getEntityName: function() {
        return this.$$entityName;
      },
  
      // dropboxbuttonable
      getHash: function () {
        return this.getEntityName()+'-'+this.getIdentifier(); // kommt aus identifyable
      },
      serialize: function() {
        return this.getIdentifier();
      },
      getHTMLCopy: function () {
        return this.createButton();
      },
      getDropBoxButton: function () {
        return this;
      },
  
      // deletable
      getDeleteRequest: function () {
        return new Psc.Request(this.$$delete);
      },
      
      
      // autocompletable
      getAutoCompleteLabel: function () {
        return this.$$ac.label;
      },
      
      
      // tabopenable
      getTab: function () {
        return new Psc.UI.Tab(this.$$tab);
      },
      
      getUrl: function () {
        return this.$$tab.url;
      },
      
      toString: function() {
        return "[Psc.CMS.FastItem]";
      }
    }
  });
});