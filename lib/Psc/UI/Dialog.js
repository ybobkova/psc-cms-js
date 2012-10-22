define(['Psc/EventDispatching', 'Psc/UI/WidgetWrapper'], function () {
  /**
   * Ein PopupDialog
   * 
   * Events:
   *  dialog-create-content([dialog, $dialog])  onCreate beim constructren
   *    wenn der content des dialogs das erste mal ausgelesen wird (bei create()).
   *    kann zu.b. dialog.setContent() aufrufen um den Inhalt des Dialogs zu bauen
   *    diese Event-Funktion kann mit onContentCreate übergeben werden
   *  dialog-submit([dialog, $dialog])   onSubmit beim constructen
   *    wenn auf "ok" geklickt wird oder submit() aufgerufen wird
   *    kann e.preventDefault() machen um zu verhindern, dass der dialog direkt danach geschlossen wird
   *    diese Event-Funktion kann mit onSubmit übergeben werden
   *
   * Bei default wird der Dialog beim submit nur geschlossen
   * es kann guid übergeben werden (string) um den dialog mit .psc-guid-$guid eindeutig zu identifzieren
   */
  Joose.Class('Psc.UI.Dialog', {
    
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.EventDispatching],
    
    // zusätzlich gehen: onCreate und onSubmit
    has: {
      //html: { is : 'rw', required: false, isPrivate: true }
      title: { is : 'rw', required: true, isPrivate: true },
      width: { is : 'rw', required: false, isPrivate: true, init: 600},
      height: { is : 'rw', required: false, isPrivate: true },
      buttons: { is : 'rw', required: false, isPrivate: true },
      content: { is : 'rw', required: false, isPrivate: true, init: '' },
      widget: { is : 'rw', required: false, isPrivate: false },
      
      eventManager: { is: 'rw', required: false, isPrivate: true, handles: [ 'on', 'one', 'off' ] },
      created: { is : 'rw', required: false, isPrivate: true, init: false }
    },
    
    after: {
      initialize: function (props) {
        if (props.onCreate) {
          this.on('dialog-create-content', props.onCreate);
          delete props.onCreate;
        }
  
        if (props.onSubmit) {
          this.on('dialog-submit', props.onSubmit);
          delete props.onSubmit;
        }
  
        if (props.onClose) {
          this.on('dialog-close', props.onClose);
          delete props.onClose;
        }
        
        if (props.closeButton) {
          this.addCloseButton(props.closeButton);
          delete props.closeButton;
        }
      }
    },
    
    methods: {
      create: function () {
        var that = this;
        
        this.widget =
          $('<div class="dialog"></div>')
            .append($('<div class="dialog-content"></div>').append(that.getContent()))
            .dialog({
              title: that.getTitle(),
              width: that.getWidth(),
              height: that.getHeight(),
              modal: true,
              buttons: that.getButtons()
            });
        
        this.guid(this.$$guid);
        
        this.$$created = true;
      },
      
      getContent: function() {
        if (!this.$$created) {
          this.getEventManager().triggerEvent('dialog-create-content', {}, [this, this.unwrap()]);
        }
        
        return this.$$content;
      },
      
      addButton: function (label, click) {
        if (!this.$$buttons) {
          this.$$buttons = {};
        }
        
        this.$$buttons[label] = click;
        return this;
      },
      
      getButtons: function () {
        if (!this.$$buttons) {
          this.addCloseButton();
          this.addSubmitButton();
        }
        
        return this.$$buttons;
      },
      
      /**
       * Fügt einen Button hinzu der close() aufruft, wenn geklickt
       */
      addCloseButton: function (label) {
        label = label || 'abbrechen';
        var that = this;
        this.addButton(label, function () {
          that.close();
        });
        return this;
      },
      
      /**
       * Fügt einen Button hinzu der submit() aufruft, wenn geklickt
       */
      addSubmitButton: function (label) {
        var that = this;
        label = label || 'Ok';
        this.addButton(label, function () {
          that.submit();
        });
        return this;
      },
      
      open: function () {
        if (!this.$$created) {
          this.create();
        }
        var that = this;
        
        this.unwrap().dialog('open');
        
        $('body').find('.ui-widget-overlay').on('click', function (e) {
          that.close();
        });
        
        return this;
      },
      
      close: function () {
        var $dialog = this.unwrap();
        
        if ($dialog && $dialog.length) {
          this.getEventManager().triggerEvent('dialog-close', {}, [this, this.unwrap()]);
          $dialog.dialog("close");
          $dialog.dialog('destroy');
          $dialog.remove();
        }
        return this;
      },
      
      isOpen: function () {
        var $dialog = this.unwrap();
        return $dialog && $dialog.length && $dialog.is(':visible');
      },
      
      submit: function () {
        var e = this.getEventManager().triggerEvent('dialog-submit', {}, [this, this.unwrap()]);
        
        if (!e.isDefaultPrevented()) {
          // do something?
          this.close();
        }
      },
      
      toString: function() {
        return "[Psc.UI.Dialog]";
      }
    }
  });
});