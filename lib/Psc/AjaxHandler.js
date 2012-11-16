define(['Psc/Exception', 'Psc/AjaxResponse','Psc/Response','Psc/AjaxException', 'Psc/Loader', 'Psc/Code'], function() {
  /**
   * Der AjaxHandler stellt einen Request an die Applikation, wertet das Ergebnis aus und gibt eine AjaxResponse zurück
   *
   */
  Joose.Class('Psc.AjaxHandler', {
    
    has: {
      request: { is : 'rw', required: false, isPrivate: true },
      response: { is : 'rw', required: false, isPrivate: true },
      jqXHR: { is : 'rw', required: false, isPrivate: false },
      spinner: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function(props) {
        
      }
    },
  
    methods: {
      handle: function (request) {
        var that = this;
        var d = $.Deferred();
        
        this.showSpinner(request);
        this.jqXHR = jQuery.ajax(
          
          this.getAjaxOptions(request)
        
        ).done(function(convertedData, textStatus, jqXHR) {
          var response = that.createResponseFromXHR(jqXHR);
          response.setBody(convertedData);
          
          that.processResponse(response, d);
  
        }).fail(function(jqXHR, textStatus, error) {
          if (textStatus === 'parsererror') {
            throw new Psc.AjaxException(textStatus, "Interner Fehler beim parsen des AjaxRequest. Unter der URL: "+request.getUrl()+" wird der Content ["+request.getFormat()+"] erwartet. jqXHR gibt '"+jqXHR.getResponseHeader('Content-Type')+"' als Content-Type zurück. jQuery meldet: "+error);
          } else if (textStatus === 'error') {
            
            that.processResponse(that.createResponseFromXHR(jqXHR), d);
  
          } else {
            throw new Psc.Exception('Unbekannter TextStatus: '+textStatus);
          }
        }).always(function () {
          that.removeSpinner(request);
        });
  
        return d.promise();
      },
      
      getAjaxOptions: function (request) {
        return {
          url: request.getUrl(),
          type: request.getMethod() === 'GET' ? 'GET' : 'POST', // wir nehmen immer post für alle anderen Requests um browserkompatibel zu sein (wir haben einen spez. Header der die Method() dann in PHP wieder richtig setzt
          global: false, // disable global events
          data: request.getConvertedBody(),
          contentType: request.getContentType(),
          dataType: request.getFormat(),
          processData: !request.isConverted(),
          beforeSend: function( jqXHR ) {
            jQuery.each(request.getHeader(), function (key, value) {
              jqXHR.setRequestHeader(key,value);
            });
          }
        };
      },
  
      createResponseFromXHR: function (jqXHR) {
        return new Psc.AjaxResponse({
            code: jqXHR.status,
            body: jqXHR.responseText,
            headers: jqXHR.getAllResponseHeaders(),
            request: this.$$request
          }
        );
      },
      
      processResponse: function (response, deferred) {
        this.setResponse(response);
        
        if (response.getCode() >= 200 && response.getCode() < 300) {
          deferred.resolveWith(this, [response]);
        } else if (response.getCode() >= 300 && response.getCode() < 400) {
          throw new Psc.AjaxException(null, "300er Code ("+response.getCode()+") beim AjaxRequest. Dies ist noch nicht implementiert");
        } else if (response.getCode() >= 400 && response.getCode() <= 500) { // include 500 for bad things
          deferred.rejectWith(this, [response]);
        } else if (response.getCode() === 0) {
          deferred.rejectWith(this, [response]);
          //throw new Psc.AjaxException(null, 'Connecton Timeout(?) '+response.getRequest().getUrl()));
        } else {
          throw new Psc.AjaxException(null, 'Code ist out of range: '+response.getCode());
        }
      },
      
      showSpinner: function (request) {
        // auf keinen fall was kaputt machen
        try {
          if (this.$$spinner) {
            this.$$spinner.show(request);
          }
        } catch (e) {
          Psc.Debug.warning(e);
        }
      },
  
      removeSpinner: function (request) {
        try {
          if (this.$$spinner) {
            this.$$spinner.remove(request);
          }
        } catch (e) {
          Psc.Debug.warning(e);
        }
      }
    }
  });
});