define(['Psc/UploadService'], function() {
  Joose.Class('Psc.Test.DoublesManager', {
    
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      getUploadService: function (dataCallback) {
        return new Psc.UploadService(
          this.mergeParams({
            exceptionProcessor: this.getExceptionProcessor(),
            ajaxService: this.getAjaxService(),
            apiUrl: '/my/test/api/url',
            uiUrl: '/my/test/ui/url',
            dataCallback: dataCallback
          })
        );
      },
  
      getExceptionProcessor: function() {
        return new (Joose.Class({
          has: {
            exception: {is: 'rw', required: false, isPrivate: false}
          },
          
          methods: {
            processException: function (e) {
              this.exception = e;
            }
          }
        }))(this.mergeParams({}));
      },
      
      getAjaxService: function () {
        return new (Joose.Class({
          has: {
            request: { is: 'rw', required: false, isPrivate: false},
            deferred: { is: 'rw', required: false, isPrivate: false}
          },
          
          methods: {
            handleAjaxRequest: function (request, ajaxHandler, defaultFailure){
              this.deferred = $.Deferred();
              
              this.request = request;
              
              return this.deferred.promise();
            }
          }
        }))(this.mergeParams({}));
      },
      
      mergeParams: function(params) {
        return params;
      },
      
      toString: function() {
        return "[Psc.Test.DoublesManager]";
      }
    }
  });
});