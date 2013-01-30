define(['joose', 'Psc/Code', 'Psc/Loader', 'Psc/AjaxHandler', 'Psc/UI/WidgetWrapper'], function(Joose) {
  Joose.Class('CoMun.Main', {
    isa: Psc.UI.WidgetWrapper,
  
    has: {
      loader: { is: 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
      }
    },
  
    methods: {
      init: function () {
        var status = this.getLoader().finished();
        
        status.fail(function (ex) {
          throw ex;
        });
      },
      
      /* interface für commentsService als ajaxService */
      handleAjaxRequest: function (request, ignored, handleDefaultFailure) {
        var that = this, d = $.Deferred();
        var ajaxHandler = new Psc.AjaxHandler();
        
        ajaxHandler.handle(request)
          .done(function(ajaxResponse) {
            d.resolve(ajaxResponse);
          })
          .fail(function (exception) {
            d.reject(exception);
            // silent
          });
          
        return d.promise();
      },
      
      /**
       * Gibt einen Loader für die Remote Tabs zurück
       *
       * ist gerade keiner vorhanden, wird ein neuer erstellt
       * alle weiteren Calls für getLoader() geben dann den aktuellen zurück
       * bis dieser mit resetLoader() zurückgesetzt wird
       */
      getLoader: function() {
        if (!this.$$loader) {
          this.$$loader = new Psc.Loader();
        }
        
        return this.$$loader;
      },
  
      resetLoader: function () {
        this.$$loader = undefined;
        return this;
      },
      
      toString: function() {
        return "[CoMun.Main]";
      }
    }
  });
});