define(['jquery-form', 'Psc/AjaxException', 'Psc/Exception', 'Psc/AjaxHandler'], function() {
  Joose.Class('Psc.AjaxFormHandler', {
    isa: Psc.AjaxHandler,
    
    has: {
      //form: { is : 'rw', required: true, isPrivate: true } // jquery form Element
    },
  
    methods: {
      handle: function(formRequest) {
        var that = this;
        var d = $.Deferred();
        var $form = formRequest.getForm();
        var options = this.getAjaxOptions(formRequest);
        this.$$request = formRequest;
        
        this.showSpinner(formRequest);
        options.success = function (convertedData, textStatus, jqXHR) {
          that.removeSpinner(formRequest);
          
          var response = that.createResponseFromXHR(jqXHR);
          response.setBody(convertedData);
          
          that.processResponse(response, d);
        };
        
        options.error = function(jqXHR, textStatus, error) {
          that.removeSpinner(formRequest);
          
          if (textStatus === 'parsererror') {
            d.reject(new Psc.AjaxException(textStatus, "Interner Fehler beim AjaxRequest. Request-Format kann nicht als erwartes Format geparsed werden. \nResponse: "+jqXHR.responseText));
          
          } else if (textStatus === 'error') {

            that.processResponse(that.createResponseFromXHR(jqXHR), d);
  
          } else {
            throw new Psc.Exception('Unbekannter TextStatus: '+textStatus);
          }
        };
        
        // submit
        $form.ajaxSubmit(options);
        
        return d.promise();
      },
      
      toString: function() {
        return "[Psc.AjaxFormHandler]";
      }
    }
  });
});