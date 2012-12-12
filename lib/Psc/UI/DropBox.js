/*globals alert:true*/
define(['jquery','jquery-ui', 'Psc/UI/DropBoxButton', 'Psc/UI/WidgetWrapper', 'Psc/CMS/FastItem', 'Psc/EventDispatching', 'Psc/Code', 'Psc/InvalidArgumentException', 'Psc/Exception'], function() {
  Joose.Class('Psc.UI.DropBox', {
    isa: Psc.UI.WidgetWrapper,
    
    does: Psc.EventDispatching,
    
    has: {
      /**
       * Erlaubt mehrere Buttons mit demselben Hash in der DropBox
       */
      multiple: { is : 'rw', required: false, isPrivate: true, init: false },
      hashMap: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      name: { is : 'rw', required: true, isPrivate: true },
      connectWith: {is: 'rw', required: false, isPrivate: true, init: false}
    },
    
    after: {
      initialize: function (props) {
        
        Psc.Code.group('DropBox', true);
        try {
          this.checkWidget();
          this.linkWidget();
          this.initWidget();
          this.initAssignedButtons();
          Psc.Code.endGroup();
        
        } catch (err) {
          Psc.Code.warning('error in init procedure');
          Psc.Code.endGroup();
          throw err;
        }
      }
    },
  
    methods: {
      initWidget: function () {
        var $dropBox = this.unwrap(), that = this, options;
        
        // ui
        $dropBox.addClass('ui-widget-content ui-corner-all');
        $dropBox.css('min-height', '110px');
        
        $dropBox.sortable(options = this.getSortableOptions());
        Psc.Code.info('DropBox: sortable',options);
  
        $dropBox.droppable(options = this.getDroppableOptions());
        Psc.Code.info('DropBox: droppable',options);
        
        // remove appended buttons on click
        $dropBox.on('click', function (e) { // wir können hier leider nicht filtern nach psc-cms-ui-button weil wir "live" funktionalität brauchen
          var $button = $(e.target);
          
          if ($button.is('button.psc-cms-ui-button')) {
            e.preventDefault();
            e.stopImmediatePropagation();
          
            that.removeButton($button);
          }
        });
        
        // standard violated event
        this.getEventManager().on('drop-box-multiple-violated', function (e, button) {
          alert('Das Element befindet sich bereits in der Box');
        });
      },
      /**
       * Durchsucht das HTML Markup des Widgets nach bereits von PHP übergebenen Buttons und indiziert diese
       *
       */
      initAssignedButtons: function () {
        var that = this, dropBoxButtonable;
        var initButtons = 0;
        
        this.findButtons().each(function (i, $button) {
          $button = $($button);
          
          dropBoxButtonable = Psc.UI.WidgetWrapper.unwrapWidget($button);
          if (that.hashButton(dropBoxButtonable.getDropBoxButton(), $button)) {
            initButtons++;
          } else {
            Psc.Code.warning('$button wird nicht gehasht und nicht hinzugefügt', $button);
          }
          
        });
        Psc.Code.info('DropBox '+this.$$name+' '+initButtons+' assigned Buttons gefunden');
      },
      
      /**
       * Fügt den DropBoxButton mit der Darstellung $button der DropBox hinzu
       *
       * parameter dropBoxButton muss ein Psc.UI.DropBoxButton sein
       */
      addButton: function(dropBoxButton, $button) {
        Psc.Code.assertRole(dropBoxButton, Psc.UI.DropBoxButton, 'button', 'DropBox.addButton()');
        
        if (this.hashButton(dropBoxButton, $button)) {
          this.unwrap().append($button);
  
          return $button;
        }
        
        return false;
      },
      
      /**
       * Fügt den DropBoxButton mit der Darstellung $button der DropBox hinzu, wenn $button schon in der DropBox vorhanden ist
       * private
       */
      hashButton: function (dropBoxButton, $button) {
        Psc.Code.assertRole(dropBoxButton, Psc.UI.DropBoxButton, 'button', 'DropBox.addButton()');
        
        var hash = dropBoxButton.getHash();
       
        // schon vorhanden
        if (this.$$hashMap[hash]) {
          
          if (this.isMultiple()) {
            this.$$hashMap[hash]++;
          } else {
            Psc.Code.warning('trigger: multiple violated', $button);
            this.getEventManager().triggerEvent('drop-box-multiple-violated', {dropBox: this}, [dropBoxButton]);
            return false;
          }
          
        // ab 1 zählen zu beginnen
        } else {
          this.$$hashMap[hash] = 1;
        }
        
        $button
          .data('dropBoxButton', dropBoxButton)
          .addClass('psc-cms-ui-button')
          .addClass('assigned-item');
        
        return this;
      },
      

      // benutzt $button für den append
      // benutzt das widget von $button welches ein Psc.CMS.FastItem sein muss
      addButtonFromLinkedFastItem: function ($button) {
        var fastItem;
        
        try {
          fastItem = Psc.UI.WidgetWrapper.unwrapWidget($button, Psc.CMS.FastItem);
        } catch (except) {
          except.setMessage('in Psc.UI.DropBox::addButtonFromLinkedFastItem: '+except.getMessage());
          throw except;
        }
        
        return this.addButton(fastItem.getDropBoxButton(), $button);
      },
      
      
      /**
       * Entfernt den $button aus der DropBox
       *
       * @param $button muss in der dropbox sein
       */
      removeButton: function ($button) {
        // wir holen uns die echte verbundene button-instance
        Psc.Code.info('removeButton', $button);
        var dropBoxButton = $button.data('dropBoxButton');
        
        if (dropBoxButton && this.unhashButton(dropBoxButton, $button)) { // gibt false zurück wenn der button nicht entfernt werden brauch
          $button.removeData('dropBoxButton');
          $button.remove();
        }
        
        return this;
      },
      
      /**
       * Entfernt die interne Referenz eines Buttons
       *
       */
      unhashButton: function (dropBoxButton, $button) {
        if (!Psc.Code.isRole(dropBoxButton, Psc.UI.DropBoxButton)) {
          Psc.Code.debug('exception parameter', dropBoxButton);
          throw new Psc.Exception('der Parameter dropBoxButton muss die Instanz eines DropBoxdropBoxButtons sein. Context: DropBox::removedropBoxButtonHash()');
        }
        
        var hash = dropBoxButton.getHash();
        
        if (this.$$hashMap[hash]) {
          this.$$hashMap[hash]--;
          
        } else {
          return false;
        }
        
        return this;
      },
      
      // entweder der jquery $button oder der DropBoxButton
      hasButton: function (mixedButton) {
        var dropBoxButton, joose;
        if (Psc.Code.isRole(mixedButton, Psc.UI.DropBoxButton)) {
          dropBoxButton = mixedButton;
        } else if(mixedButton.jquery && (!mixedButton.length || !mixedButton.parent().length)) {
          return false;
        } else {
          try {
            dropBoxButton = this.unwrapButton(mixedButton);
          } catch (e) {
            return false;
          }
        }
        
        var hash = dropBoxButton.getHash();
        return (this.$$hashMap[hash] && this.$$hashMap[hash] > 0) ? true : false;
      },
      
      serialize: function (data) {
        var buttonsData = [], that = this;
        
        this.findButtons().each(function () {
          var $button = $(this), serialized, dropBoxButton;
          
          try {
            dropBoxButton = that.unwrapButton($button);

            serialized = dropBoxButton.serialize();
            Psc.Code.info('serialize: ', dropBoxButton, serialized);
            buttonsData.push(serialized);
          
          } catch (ex) {
            Psc.Code.warning('internal error: button is assigned but has no dropBoxButton as data entry');
          }
        });
        
        data[this.$$name] = buttonsData;
      },
      
      findButtons: function () {
        return this.unwrap().find('button.psc-cms-ui-button');
      },
      getSortableOptions: function () {
        var that = this, options;
        
        options = {
          cancel: false, // damit buttons gehen
          appendTo: 'body',
          connectWith: this.$$connectWith,
          start: function (event, ui) {
            ui.helper.data('dropBoxSorting', true);
          },
          
          update: function (event,ui) {
            // update erhalten beide dropboxen. wir wollen nur einmal triggern wenn wir intern sortieren, oder received haben
            if (!ui.sender) { 
              that.unwrap().trigger('unsaved');
            }
          },
          
          // wir sind im connectWith modus und zu uns wurde ein Button (physikalisch) hinsortiert
          receive: function (event, ui) {
            try {
              //Psc.Code.info('receive: ', ui, that.unwrap());
              var $button = ui.item, dropBoxButton = that.unwrapButton($button);
            
              that.hashButton(dropBoxButton, $button);
              $button.removeClass('ui-state-hover');
            
            } catch (ex) { // jquery ui klaut uns sonst die exception einfach
              Psc.Code.error(ex);
            }
          },
          
          // wir sind im connectWith modus und von uns wurde ein button (physikalisch) wegsortiert
          remove: function (event, ui) {
            try {
              //Psc.Code.info('remove: ', ui, that.unwrap());
              var $button = ui.item, dropBoxButton = that.unwrapButton($button);
            
              that.unhashButton(dropBoxButton, $button);
            } catch (ex) { // jquery ui klaut uns sonst die exception einfach
              Psc.Code.error(ex);
            }
          }
        };
        
        return options;
      },
      
      unwrapButton: function($button) {
        var dropBoxButton = $button.data('dropBoxButton');
        
        if (!Psc.Code.isInstanceOf(dropBoxButton, Psc.UI.DropBoxButton)) {
          throw new Psc.Exception('Kann aus $button keinen Psc.UI.DropBoxButton unwrappen');
        }
        
        return dropBoxButton;
      },
      
      getDroppableOptions: function () {
        var that = this;
        
        return {
          hoverClass: 'hover',
          drop: function (e, ui) {
            if (ui.helper.data('dropBoxSorting')) {
              return; // wir filtern die events des internen (innerhalb der DropBox) sortierens heraus
            }
            
            var fastItem, $button;
            
            // geht davon aus, dass ui.draggable immer ein Psc.CMS.FastItem ist
            // theoretisch reicht hier aber DropBoxButtonable, wir wollen aber alles von Psc.CMS.FastItem beibehalten
            fastItem = Psc.UI.WidgetWrapper.unwrapWidget(ui.draggable, Psc.CMS.FastItem);
            
            // erstelle einen neuen Button / eine Kopie, damit das draggable nicht removed wird
            that.addButton(fastItem.getDropBoxButton(), $button = fastItem.createButton());
            
            // eigentlich wollen wir hier 1 fastItem mit 2 Widgets
            Psc.UI.WidgetWrapper.wrapWidget($button, fastItem);
            
            that.unwrap().trigger('unsaved');
          }
        };
      },
      
      /**
       * @return string|false
       */
      isConnectedWith: function () {
        return this.$$connectWith ? this.$$connectWith : false;
      },
      
      isMultiple: function () {
        return this.$$multiple;
      },
      toString: function() {
        return "[Psc.UI.DropBox]";
      }
    }
  });
});  