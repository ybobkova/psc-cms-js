define(['joose', 'Psc/UploadService', 'Psc/UI/TestInteractionProvider'], function(Joose) {
  Joose.Class('Psc.Test.DoublesManager', {
    
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      injectInteractionProvider: function(interactionProvidingClass) {
        var provider = new Psc.UI.TestInteractionProvider();
        
        interactionProvidingClass.setInteractionProvider(provider);
        
        return provider;
      },
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
      
      getLayoutManagerComponentMock: function (type, content) {
        var LayoutManagerComponentClass = this.getLayoutManagerComponentMockClass();
        
        return new LayoutManagerComponentClass({
          testContent: content,
          testType: type
        });
      },
      
      getLayoutManagerComponentMockClass: function () {
        return Joose.Class({
          isa: Psc.UI.LayoutManagerComponent,
        
          has: {
            testContent: { is : 'rw', required: false, isPrivate: true },
            testType: { is : 'rw', required: false, isPrivate: true, init: "some-widget" }
          },
          
          before: {
            initialize: function () {
              this.$$type = this.$$testType;
            }
          },
          
          methods: {
            createWithMiniPanel: function(buttons) {
              var panel = this.createMiniButtonPanel(buttons);
              
              this.$$testContent = panel.html();
            },
            
            createContent: function() {
              return this.$$content = this.$$testContent;
            }
          }
        });
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