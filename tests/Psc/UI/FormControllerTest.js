define(['psc-tests-assert','Psc/UI/FormController', 'Psc/EventManagerMock','Psc/AjaxHandler'], function() {
  module("Psc.UI.FormController");
  
  $('#qunit-fixture').append('<form></form>')
  var $form = $('#qunit-fixture').find('form');
  var evm = new Psc.EventManagerMock({ denySilent: true, allow: []});

  test("acceptance", function() {
    expect(0);
    var ajaxFormHandler = new Psc.AjaxFormHandler({});
    var evm = new Psc.EventManagerMock({ denySilent: true, allow: []});
    
    var formController = new Psc.UI.FormController({ form: $form, ajaxFormHandler: ajaxFormHandler, eventManager: evm });
  });
  
  test("controller triggers form-saved on done()", function () {
    var deferred = $.Deferred();
    var response = new Psc.Response({code: 200, reason: 'OK'});
    var ajaxFormHandlerClass = Class({
      isa: 'Psc.AjaxFormHandler',
      
      override: {
        handle: function (formRequest) {
          this.assertSame($form, formRequest.getForm(), 'form is set correctly in FormRequest');
          return deferred.promise();
        }
      }
    });
    
    var ajaxFormHandler = new ajaxFormHandlerClass({});
    var formController = new Psc.UI.FormController({ form: $form, ajaxFormHandler: ajaxFormHandler, eventManager: evm });
    formController.save();
    
    deferred.resolve(response);
    
    this.assertNotFalse(evm.wasTriggered('form-saved',1, function (e, $eventForm, eventResponse) {
      this.assertSame($form, $eventForm );
      this.assertSame(response, eventResponse);
      return true;
    }), 'form-saved was triggered');
    
  });
    
  test("controller triggers error-form-save on reject()", function () {
    var deferred = $.Deferred();
    var response = new Psc.Response({code: 404, reason: 'Not Found'});
    var ajaxFormHandlerClass = Class({
      isa: 'Psc.AjaxFormHandler',
      
      override: {
        handle: function (formRequest) {
          this.assertSame($form, formRequest.getForm(), 'form is set correctly in FormRequest');
          return deferred.promise();
        }
      }
    });
    
    var ajaxFormHandler = new ajaxFormHandlerClass({});
    var formController = new Psc.UI.FormController({ form: $form, ajaxFormHandler: ajaxFormHandler, eventManager: evm });
    formController.save();
    
    deferred.reject(response);

    this.assertNotFalse(evm.wasTriggered('error-form-save',1, function (e, $eventForm, eventResponse) {
      this.assertSame($form, $eventForm );
      this.assertSame(response, eventResponse);
      return true;
    }), 'error-form-save was triggered');
    
  });
  
  test("controller displays error pane on form-error-save", function ()  {
    var formController = new Psc.UI.FormController({ form: $form});
    var response = new Psc.Response({code: 500, reason: 'Internal Server Error'});
    
    formController.getEventManager().triggerEvent('error-form-save', {}, [formController.getForm(), response]);
  });

  test("controller displays error pane on form-error-exception", function ()  {
    var formController = new Psc.UI.FormController({ form: $form});
    var exception = new Psc.Exception('Fehler beim convertieren des Ajax Requests');
    var formRequest = new Psc.FormRequest({form: $form});
    
    formController.getEventManager().triggerEvent('error-form-exception', {}, [exception, formRequest, formController.getForm()]);
    this.assertEquals(1,$form.find('div.psc-cms-ui-error-pane').length,'Error pane found in $form');

    this.assertEquals(1,$form.find('div.psc-cms-ui-error-pane:visible').length,'Error pane found in $form');
    
    var $debug = $form.find('div.psc-cms-ui-error-pane').clone();
    $('#visible-fixture').html($debug);
  });


  test("controller removes error pane after form-error-save and then success", function ()  {
    var formController = new Psc.UI.FormController({ form: $form});
    var response = new Psc.Response({code: 200, reason: 'OK'});
    
    formController.getEventManager().triggerEvent('error-form-save', {}, [formController.getForm(), response]);
    this.assertEquals(1,$form.find('div.psc-cms-ui-error-pane').length,'Error pane found in $form');
    
    formController.getEventManager().triggerEvent('form-saved', {}, [formController.getForm(), response, undefined]);
    this.assertEquals(0,$form.find('div.psc-cms-ui-error-pane').length,'Error pane is removed on successful save');
  });
  
  
  test("controller calls serialization callbacks before save", function ()  {
    expect(4);
    
    var deferred = $.Deferred();
    var ajaxFormHandlerMock = Class({
      isa: 'Psc.AjaxFormHandler',
      
      override: {
        handle: function (formRequest) {
          var post = formRequest.getBody();
      
          this.assertAttributeEquals(true, 'myCustomKey1', post); // 3
          this.assertAttributeEquals(true, 'myCustomKey2', post); // 4
          return deferred.promise();
        }
      }
    });

    var formController = new Psc.UI.FormController({ form: $form, ajaxFormHandler: new ajaxFormHandlerMock({}) });
    
    formController.onSerialization(function ($serForm, data) {
      this.assertSame($form, $serForm, 'serialization form is the expected one'); // 1
      this.assertNotUndefined(data); // 2
      
      data.myCustomKey1 = true;
    });

    formController.onSerialization(function ($serForm, data) {
      data.myCustomKey2 = true;
    });
    
    formController.save();
    start();
  });
});