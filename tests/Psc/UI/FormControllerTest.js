define(['psc-tests-assert','joose', 'Psc/UI/FormController', 'Psc/EventManagerMock','Psc/AjaxHandler', 'Psc/AjaxFormHandler'], function(t, Joose) {
  
  module("Psc.UI.FormController");
  
  var setup = function(test) {
    $('#qunit-fixture').empty().append('<form></form>');
    var $form = $('#qunit-fixture').find('form');
    var evm = new Psc.EventManagerMock({ denySilent: true, allow: []});
    
    return t.setup(test, {$form: $form, evm: evm});
  };

  test("controller triggers form-saved on done()", function () {
    var that = setup(this);
    var deferred = $.Deferred();
    var response = new Psc.Response({code: 200, reason: 'OK'});
    var AjaxFormHandlerClass = Joose.Class({
      isa: Psc.AjaxFormHandler,
      
      override: {
        handle: function (formRequest) {
          that.assertSame(that.$form, formRequest.getForm(), 'form is set correctly in FormRequest');
          return deferred.promise();
        }
      }
    });
    
    var formController = new Psc.UI.FormController({
      form: that.$form,
      ajaxFormHandler: new AjaxFormHandlerClass({}),
      eventManager: that.evm
    });
    
    formController.save();
    
    deferred.resolve(response);
    
    this.assertNotFalse(that.evm.wasTriggered('form-saved',1, function (e, $eventForm, eventResponse) {
      that.assertSame(that.$form, $eventForm );
      that.assertSame(response, eventResponse);
      return true;
    }), 'form-saved was triggered');
  });
    
  test("controller triggers error-form-save on reject()", function () {
    var that = setup(this);
    

    var deferred = $.Deferred();
    var response = new Psc.Response({code: 404, reason: 'Not Found'});
    var AjaxFormHandlerClass = Joose.Class({
      isa: Psc.AjaxFormHandler,
      
      override: {
        handle: function (formRequest) {
          that.assertSame(that.$form, formRequest.getForm(), 'form is set correctly in FormRequest');
          return deferred.promise();
        }
      }
    });
    
    var formController = new Psc.UI.FormController({
      form: that.$form,
      ajaxFormHandler: new AjaxFormHandlerClass({}),
      eventManager: that.evm
    });
    
    formController.save();
    
    deferred.reject(response);

    this.assertNotFalse(that.evm.wasTriggered('error-form-save',1, function (e, $eventForm, eventResponse) {
      that.assertSame(that.$form, $eventForm );
      that.assertSame(response, eventResponse);
      return true;
    }), 'error-form-save was triggered');
  });
  
  test("controller displays error pane on form-error-save", function ()  {
    var that = setup(this);
    var formController = new Psc.UI.FormController({ form: that.$form });
    var response = new Psc.Response({code: 500, reason: 'Internal Server Error'});
    
    formController.getEventManager().triggerEvent('error-form-save', {}, [formController.getForm(), response]);
    this.assertEquals(1, that.$form.find('div.psc-cms-ui-error-pane').length, 'Error pane found in $form');
    this.assertEquals(1, that.$form.find('div.psc-cms-ui-error-pane:visible').length, 'Error pane found in $form');
  });

  test("controller displays error pane on form-error-exception", function ()  {
    var that = setup(this);
    var formController = new Psc.UI.FormController({ form: that.$form});
    var exception = new Psc.Exception('Fehler beim convertieren des Ajax Requests');
    var formRequest = new Psc.FormRequest({form: that.$form});
    
    formController.getEventManager().triggerEvent('error-form-exception', {}, [exception, formRequest, formController.getForm()]);
    this.assertEquals(1, that.$form.find('div.psc-cms-ui-error-pane').length, 'Error pane found in $form');
    this.assertEquals(1, that.$form.find('div.psc-cms-ui-error-pane:visible').length, 'Error pane found in $form');
  });

  test("controller removes error pane after form-error-save and then success", function ()  {
    var that = setup(this);
    var formController = new Psc.UI.FormController({ form: that.$form });
    var response = new Psc.Response({code: 200, reason: 'OK'});
    
    formController.getEventManager().triggerEvent('error-form-save', {}, [formController.getForm(), response]);
    this.assertEquals(1, that.$form.find('div.psc-cms-ui-error-pane').length, 'Error pane found in $form');
    
    formController.getEventManager().triggerEvent('form-saved', {}, [formController.getForm(), response, undefined]);
    this.assertEquals(0, that.$form.find('div.psc-cms-ui-error-pane').length, 'Error pane is removed on successful save');
  });
  
  test("controller calls serialization callbacks before save", function ()  {
    var that = setup(this);
    expect(4);
    
    var deferred = $.Deferred();
    var AjaxFormHandlerMock = Joose.Class({
      isa: Psc.AjaxFormHandler,
      
      override: {
        handle: function (formRequest) {
          var post = formRequest.getBody();
      
          that.assertAttributeEquals(true, 'myCustomKey1', post); // 3
          that.assertAttributeEquals(true, 'myCustomKey2', post); // 4
          return deferred.promise();
        }
      }
    });

    var formController = new Psc.UI.FormController({
      form: that.$form,
      ajaxFormHandler: new AjaxFormHandlerMock({})
    });
    
    formController.onSerialization(function ($serForm, data) {
      that.assertSame(that.$form, $serForm, 'serialization form is the expected one'); // 1
      that.assertNotUndefined(data); // 2
      
      data.myCustomKey1 = true;
    });

    formController.onSerialization(function ($serForm, data) {
      data.myCustomKey2 = true;
    });
    
    formController.save();
  });
  
  test("formCOntroller has a static function that changes/reads the hidden input revision field to a new revision", function () {
    var that = setup(this);
    
    this.$form.append(
      '<input class="psc-cms-ui-http-header" type="hidden" name="X-Psc-Cms-Revision" value="unknown"/>'
    );
    
    var read = function () {
      return that.$form.find('input[name="X-Psc-Cms-Revision"]').val();
    };
    
    this.assertEquals(
      'unknown',
      read()
    );
    
    var newRevision = 'preview-1';
    Psc.UI.FormController.changeRevision(newRevision, this.$form); // use some unique preview identifier because of concurrency
    
    this.assertEquals(
      newRevision,
      read()
    );
    
    this.assertSame(
      read(),
      Psc.UI.FormController.readRevision(this.$form)
    );
  });
});