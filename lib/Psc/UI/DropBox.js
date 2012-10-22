/*globals alert:true*/
define(['Psc/UI/DropBoxButton', 'Psc/UI/WidgetWrapper', 'Psc/EventDispatching', 'Psc/Code', 'Psc/InvalidArgumentException', 'Psc/Exception'], function() {
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
        this.checkWidget();
        this.initWidget();
        this.linkWidget();
        this.initAssignedButtons();
        Psc.Code.endGroup();
      }
    },
  
    methods: {
      initWidget: function () {
        var $dropBox = this.unwrap(), that = this, options;
        
        // ui
        $dropBox.addJoose.Class('ui-widget-content ui-corner-all');
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
          
          that.addButtonHash(dropBoxButtonable.getDropBoxButton(),$button);
          initButtons++;
        });
        Psc.Code.info('DropBox '+this.$$name+' '+initButtons+' assigned Buttons gefunden');
      },
      
      /**
       * Fügt die HTML Copy eines Buttons und die interne Referenz zur DropBox hinzu
       *
       * parameter button muss ein Psc.UI.DropBoxButton sein
       * erstellt eine Kopie des Buttons mit getHTMLCopy() und fügt diese der DropBox zu. Diese HTMlKopie wird mit dem DropBoxButton verlinkt
       */
      addButton: function(button) {
        Psc.Code.assertJoose.Role(button, Psc.UI.DropBoxButton, 'button', 'DropBox.addButton()');
        
        var $button = $(button.getHTMLCopy());
        
        // indizieren / verlinken / hashen
        if (this.addButtonHash(button, $button)) {
          // hier erst append / dann remove ? weil wir glaub ich für den hash brauchen, dass $button im DOM ist
          
          // append
          this.unwrap().append($button);
  
          // weil sortabel doofe ohren hat, geben wir dem button mit style eine feste breite,
          // aber nur wenn wir schon attached sind und so
          if ($button.outerWidth() > 4) {
            $button.css('width', $button.outerWidth()+2+'px'); // +2 weil hier irgendwo ein rand vergessen wird
          }
          
          return $button;
        }
        
        return false;
      },
      
      /**
       * Fügt die Interne Referenz des Buttons hinzu
       * private
       */
      addButtonHash: function (button, $button) {
        if (!Psc.Code.isJoose.Role(button, Psc.UI.DropBoxButton)) {
          Psc.Code.debug('Roles des Exception Parameters: '+Psc.Code.getRoles(button));
          throw new Psc.InvalidArgumentException('button','Psc.UI.DropBoxButton', button, 'DropBox.addButtonHash()');
        }
        if (!$button.length) {
          throw new Psc.InvalidArgumentException('$button', 'jQuery:button', $button, 'DropBox.addButtonHash()');
        }
        
        var hash = button.getHash();
       
        // schon vorhanden
        if (this.$$hashMap[hash]) {
          
          if (this.isMultiple()) {
            this.$$hashMap[hash]++;
          } else {
            Psc.Code.warning('trigger: multiple violated', $button);
            this.getEventManager().triggerEvent('drop-box-multiple-violated', {dropBox: this}, [button]);
            return false;
          }
          
        // ab 1 zählen zu beginnen
        } else {
          this.$$hashMap[hash] = 1;
        }
  
        // link button zu $button:
        // also irgendwie $.data($button) geht nicht (wenn wir dann ein neues jQuery objekt für $button[0] erzeugen ists weg)
        // $button.data() geht aber auch wenn wir ein neues jQuery erstellen. Vermutlich erstellt die lowlevel fuktion $.data(xx) immer die daten an das objekt und nicht an das dom. (irgendwie so)
        $button.data('drop-box-button', button);
        
        $button.addJoose.Class('psc-cms-ui-button')
               .addJoose.Class('assigned-item');
        
        if ($button.parent().length) {
          // weil sortabel doofe ohren hat, geben wir dem button mit style eine feste breite
          Psc.Code.info($button.outerWidth);
          if ($button.outerWidth() > 4) {
            $button.css('width', $button.outerWidth()+2+'px'); // +2 weil hier irgendwo ein rand vergessen wird
          }
        }
        
        return this;
      },
      
      /**
       * Entfernt die HTML Copy des Button und die Interne Referenz aus der Dropbox
       *
       * @param $button nicht der Psc.UI.DropBoxButton sondern eine Ausgabe von getHTMLCopy() davon
       */
      removeButton: function ($button) {
        // wir holen uns die echte verbundene button-instance
        Psc.Code.info('removeButton', $button);
        var button = $button.data('drop-box-button');
        
        if (this.removeButtonHash(button, $button)) { // gibt false zurück wenn der button nicht entfernt werden brauch
          $button.remove();
        }
        
        return this;
      },
      
      /**
       * Entfernt die interne Referenz eines Buttons
       *
       * @param $button nicht der Psc.UI.DropBoxButton sondern eine Ausgabe von getHTMLCopy() davon
       */
      removeButtonHash: function (button, $button) {
        if (!Psc.Code.isJoose.Role(button, Psc.UI.DropBoxButton)) {
          Psc.Code.debug('exception parameter', button);
          throw new Psc.Exception('der Parameter button muss die Instanz eines DropBoxButtons sein. Context: DropBox::removeButtonHash()');
        }
        
        var hash = button.getHash();
        
        if (this.$$hashMap[hash]) {
          this.$$hashMap[hash]--;
        } else {
          Psc.Code.warning('Button ist nicht in der Hashmap und wird deshalb nicht entfernt', $button);
          return false;
        }
        
        return this;
      },
      
      // entweder der jquery $button oder der DropBoxButton
      hasButton: function (mixedButton) {
        var button, joose;
        if (Psc.Code.isJoose.Role(mixedButton, Psc.UI.DropBoxButton)) {
          button = mixedButton;
        } else if (mixedButton.length && mixedButton.jquery && mixedButton.data('drop-box-button')) {
          button = mixedButton.data('drop-box-button');
        } else if (mixedButton.length && mixedButton.jquery && !mixedButton.parent().length) {
          return false; // detached jquery buttons sind garantiert nicht hier
        } else {
          Psc.Code.debug('exception button', mixedButton, mixedButton.data('joose'));
          throw new Psc.Exception('Button kann nicht ermittelt werden. entweder jquery-button oder Psc.UI.DropBoxButton übergeben. Context: DropBox::hasButton()');
        }
        
        var hash = button.getHash();
        return (this.$$hashMap[hash] && this.$$hashMap[hash] > 0) ? true : false;
      },
      
      serialize: function (data) {
        var buttonsData = [], $button, button, that = this;
        
        // jeden button der assigned ist zum serializieren bitten
        this.findButtons().each(function () {
          $button = $(this);
          
          button = $button.data('drop-box-button');
          if (!button) {
            Psc.Code.debug('exception button',$button);
            throw new Psc.Exception('button in der drop-box wurde nicht initialiisiert (data:drop-box-button ist nicht gesetzt)');
          }
          
          Psc.Code.info('serialize: ',button, button.serialize());
          buttonsData.push(button.serialize());
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
            //Psc.Code.info('start: setting drop-box-sorting', ui);
            ui.helper.data('drop-box-sorting', true);
          },
          
          update: function (event,ui) {
            if (!ui.sender) { // update erhalten beide dropboxen. wir wollen nur einmal triggern wenn wir intern sortieren, oder received haben
              that.unwrap().trigger('unsaved');
            }
          },
          // wir sind im connectWith modus und zu uns wurde ein Button hinsortiert
          receive: function (event, ui) {
            Psc.Code.info('receive: ', ui, that.unwrap());
            var $button = ui.item, button = $button.data('drop-box-button').getDropBoxButton();
            
            // wir hashen den button
            that.addButtonHash(button, $button);
            $button.removeJoose.Class('ui-state-hover');
          },
          
          // wir sind im connectWith modus und von uns wurde ein button wegsortiert
          remove: function (event, ui) {
            Psc.Code.info('remove: ', ui, that.unwrap());
            var $button = ui.item, button = $button.data('drop-box-button').getDropBoxButton();
            
            // wir removeHashen den button
            that.removeButtonHash(button, $button);
          }
        };
        
        return options;
      },
      
      getDroppableOptions: function () {
        var that = this;
        
        return {
          hoverClass: 'hover',
          drop: function (e, ui) {
            if (ui.helper.data('drop-box-sorting')) return; // wir filtern die events des internen sortierens heraus
            var item = ui.draggable.data('joose');
            
            if (!item) {
              Psc.Code.warning('drop target ist kein item', ui.draggable);
              return;
            }          
            
            that.addButton(item.getDropBoxButton());
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