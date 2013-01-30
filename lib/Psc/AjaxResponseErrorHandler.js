define(['joose', 'Psc/UI/ErrorPane', 'Psc/UI/Dialog','Psc/ResponseMetaReader','Psc/UI/Group'], function(Joose) {
  Joose.Class('Psc.AjaxResponseErrorHandler', {
    
    my: {
      methods: {
        openDialog: function (response) {
          var handler = new Psc.AjaxResponseErrorHandler({
            response: response
          });
          
          return handler.createDialog().open();
        }
      }
    },
    
    has: {
      response: { is : 'r', required: true, isPrivate: true }
    },
    
    methods: {
      /**
       * Returns the body of the ajaxResponse error with a short message
       *
       * if message cannot be parsed, the whole body is returned
       *
       * @return string html
       */
      getErrorMessage: function () {
        var headers = this.$$response.getHeader(), msg;
       
        if (headers['X-Psc-CMS-Error'] === 'true') {
          msg = headers['X-Psc-CMS-Error-Message'];
        } else {
          msg = this.$$response.getBody();
        }
        
        return msg.replace(/\n/, "<br />\n").substring(0, 300);
      },
      
      /**
       * @return dialog
       */
      createDialog: function() {
        var that = this;
        
        var dialog = new Psc.UI.Dialog({
          title: 'Ein Fehler ist aufgetreten',
          closeButton: "schließen",
          width: '50%',
          onCreate: function (e, dialog) {
            //var group = new Psc.UI.Group({
            //    label: 'Fehler',
            //    content: that.getErrorMessage(),
            //});
            
            dialog.setContent(
              $('<div class="psc-cms-ui-error-pane" />').append(that.getErrorMessage())
            );
          }
        });
        
        return dialog;
      },
      
      /**
       * Fügt einem container den error pane hinzu
       *
       * mit display() kann dieser dann in $container angzeigt werden (wird davor gehängt mit prepend());
       *
       * not working
       */
      appendErrorPane: function ($container) {
        var that = this;
        
        return new Psc.UI.ErrorPane({
          label: 'Error',
          container: $container,
          errorMessage: that.getErrorMessage()
        });
      }
    }
  });
});
