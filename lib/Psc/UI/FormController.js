define(
  [
   'Psc/EventManager', 'Psc/AjaxFormHandler', 'Psc/FormRequest','Psc/ResponseMetaReader','Psc/UI/EffectsManager',
   'Psc/Code', 'Psc/Response',
   'Psc/UI/WidgetWrapper', 'Psc/UI/GridTable', 'Psc/UI/ErrorPane', 'Psc/EventDispatching'
  ], function () {
  
  Joose.Class('Psc.UI.FormController', {
    
    does: [Psc.EventDispatching],
    
    has: {
      form: { is : 'rw', required: true, isPrivate: true },
      ajaxFormHandler: { is : 'rw', required: false, isPrivate: true },
      effectsManager: { is : 'rw', required: false, isPrivate: true },
      errorPane: { is : 'rw', required: false, isPrivate: true },
      serializationCallbacks: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
        if (!props.ajaxFormHandler) {
          this.$$ajaxFormHandler = new Psc.AjaxFormHandler();
        }
        if (!props.effectsManager) {
          this.$$effectsManager = new Psc.UI.EffectsManager();
        }
        
        // das oben in der init funktion erzeugt keine neue reference. ichg laube das hängt sich an den prototype
        this.$$serializationCallbacks = $.Callbacks('unique');
        
        this.initEvents();
      }
    },
  
    methods: {
      /**
       * Speichert den aktuellen Tab
       * 
       * wenn tabHook false zurückgibt wird der neue tab nicht geöffnet
       */
      save: function (tabHook) {
        /* wir holen uns alle items aus dem formular mit den nötigen informationen und bauen daraus ein paket welches wir per ajax posten */
        var formRequest = new Psc.FormRequest({form: this.$$form});
        var that = this;
        var evm = this.getEventManager();
        
        formRequest.setBody(this.serialize());
  
        this.$$ajaxFormHandler.handle(formRequest)
           .done(function (response) {
             evm.triggerEvent(
               'form-saved', {}, [that.getForm(), response, tabHook]
             );
           })
           .fail(function (response) {
            if (Psc.Code.isInstanceOf(response, Psc.Response)) {
             evm.triggerEvent(
               'error-form-save', {}, [that.getForm(), response]
             );
            } else {
             evm.triggerEvent(
               'error-form-exception', {}, [response, formRequest, that.getForm()]
             );
            }
           });
      },
      initEvents: function() {
        var that = this;
        
        this.getEventManager().on('error-form-exception', function(e, exception, formRequest, $form) {
          that.getEffectsManager().errorBlink($form);
          
          var label = 'Es ist ein unerwarteter Fehler beim Speichern aufgetreten. Dies sollte normal nicht passieren und ist ein Programmierfehler.';
          
          var exceptionText;
          if (Psc.Code.isInstanceOf(exception, Psc.Exception)) {
            exceptionText = "Fehler: "+exception.getName()+": "+exception.getMessage();
          } else {
            exceptionText = "Fehler: "+JSON.stringify(exception);
          }
          
          that.setErrorPane(new Psc.UI.ErrorPane({
            label: label,
            container: $form,
            errorMessage:
              "Request: "+formRequest.toString()+"\n\n"+
              "Body: "+JSON.stringify(formRequest.getBody())+"\n\n"+
              exceptionText
          }));
          
          that.getErrorPane().display();
        });
        
        this.getEventManager().on('error-form-save', function(e, $form, response) {
          that.getEffectsManager().errorBlink($form);
          
          var label = 'Es ist ein Fehler beim Speichern aufgetreten';
          
          // @TODO meta-validation-errors anzeigen und so
          
          //var meta = new Psc.ResponseMetaReader({response: response});
          //if (meta.has(['validation'])) {
          //  errorMessage = errorMessage +"\n\n";
          //  var i, verrors = meta.get(['validation']);
          //  for (i = 0; i<= verrors.length; i++) {
          //    errorMessage = errorMessage +
          //      "Feld "+meta.get(['validation',i,'label'])+" ist nicht korrekt ausgefüllt worden: "+meta.get(['validation',i,'msg'])+"\n\n";
          //  }
          //}
          that.setErrorPane(new Psc.UI.ErrorPane({
            label: label,
            container: $form,
            errorMessage: response.getBody()
          }));
          
          that.getErrorPane().display();
        });
        
        
        this.getEventManager().on('form-saved', function (e) {
          if (that.getErrorPane()) {
            that.getErrorPane().hide();
            that.removeErrorPane();
          }
        });
  
      },
      removeErrorPane: function () {
        if (this.$$errorPane) {
          delete this.$errorPane;
        }
      },
      serialize: function () {
        var data = {};
        
        Psc.Code.group('serialize Form');
        
        // ein interface wäre prima? aber wie finden wir die elemente die das interface implementieren?
        
        /* buttons in dropboxen holen */
        this.$$form.find('div.psc-cms-ui-drop-box').each(function () {
          var joose = $(this).data('joose');
          
          Psc.Code.info('try serialize drop-box', joose);
          if (joose) {
            joose.serialize(data);
          }
          Psc.Code.info('data', data);
        });
        
        /* Comboboxen im Select Modus holen */
        this.$$form.find('input.psc-cms-ui-combo-box').each(function () {
          var joose = $(this).data('joose');
          Psc.Code.info('try serialize combo-box:', joose);
          if (joose) {
            joose.serialize(data);
          }
          Psc.Code.info('data', data);
        });
        
        // tables
        this.$$form.find('.psc-cms-ui-grid-table').each(function () {
          var $widget = $(this);
          
          Psc.Code.info('try serialize grid-table:', $widget);
          var joose = Psc.UI.WidgetWrapper.unwrapWidget($widget, Psc.UI.GridTable);
          
          joose.serialize(data);
        });
  
        /* AceEditor Contents holen */
        this.$$form.find('div.psc-cms-ui-ace-editor').each(function () {
          var joose = $(this).data('joose');
          joose.serialize(data);
        });
        
        /* generics */
        if (this.$$form.is('.psc-cms-ui-serializable')) {
          var joose = this.$$form.data('joose');
          Psc.Code.info('serializable found:', this.$$form, joose);
          joose.serialize(data);
        }
        
        this.$$form.find('.psc-cms-ui-serializable').each(function () {
          var joose = $(this).data('joose');
          Psc.Code.info('serializable found:', $(this));
          joose.serialize(data);
        });
        
        /* Custom Data aus den Callbacks von onSerializiation holen */
          Psc.Code.group('customSerialization');
          this.$$serializationCallbacks.fire(this.$$form, data);
          Psc.Code.endGroup('customSerialization');
        
        //Psc.Code.info('end');
        Psc.Code.endGroup();
        
        return data;
      },
      
      /**
       * Fügt einen Callback hinzu um Daten dem Request hinzufügen zu können
       *
       * callback($form, object data)
       * in data können die properties direkt als bestandteile des bodys übergeben werden
       */
      onSerialization: function (callback) {
        this.$$serializationCallbacks.add(callback);
        return this;
      },
      
      toString: function() {
        return "[Psc.UI.FormController]";
      }
    }
  });
});