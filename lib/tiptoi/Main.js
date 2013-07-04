define(['joose', 'Psc/Request', 'Psc/Code', 'Psc/UI/WidgetWrapper'], function(Joose) {
  Joose.Class('tiptoi.Main', {
    isa: Psc.UI.WidgetWrapper,

    has: {
      productName: { is : 'rw', required: true, isPrivate: true },
      main: { is : 'rw', required: true, isPrivate: true, handles: [ 'handleAjaxRequest' ] }
    },
    
    after: {
      initialize: function () {
        this.$$main.register(this, 'tiptoiMain');
      }
    },
  
    methods: {
      createAction: function (data) {
        return this.$$main.handleAjaxRequest(
          this.createRequest(['matrix-manager', 'create-action'], 'GET', data, 'html')
        );
      },
  
      createTransition: function (data) {
        return this.$$main.handleAjaxRequest(
          this.createRequest(['matrix-manager', 'create-transition'], 'GET', data, 'html')
        );
      },
      
      dispatch: function (request) {
        return this.$$main.handleAjaxRequest(
          request
        );
      },
      
      createRequest: function(urlParts, method, body, format, sendAs) {
        if (!method) { method = 'GET'; }
        if (!format) { format = 'json'; }
  
        var request = new Psc.Request({
          url: '/api/product/'+this.$$productName+'/'+urlParts.join('/'),
          method: method,
          body: body,
          format: format,
          sendAs: sendAs
        });
        
        return request;
      },
      toString: function() {
        return "[tiptoi.Main]";
      }
    }
  });
});