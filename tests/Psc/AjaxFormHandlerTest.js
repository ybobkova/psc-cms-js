define(['psc-tests-assert','text!fixtures/form.html', 'require', 'Psc/AjaxFormHandler','Psc/FormRequest','Psc/Exception'], function (t, html, require) {

  module("Psc.AjaxFormHandler");
  
  var setup = function(test) {
    return t.setup(test);
  };
  
  asyncTest("sendsAndGetsForm", function() {
    var that = setup(this);

    var $form = $(html);
    var formRequest = new Psc.FormRequest({form: $form});
    // mock
    formRequest.setMethod('GET');
    formRequest.setUrl(
      require.toUrl('fixtures/response.form-saved.json')
    );
    
    var ajaxFormHandler = new Psc.AjaxFormHandler();
    var req = ajaxFormHandler.handle(formRequest);
      
    req.done(function (response) { // responste sollte http.form.saved.php sein
      that.assertInstanceOf(Psc.Response, response);
      that.assertEquals(200,response.getCode());
      var body = response.getBody();
      that.assertEquals(2,body.id);
      that.assertFalse(body.yearKnown);
      that.assertEquals("5698800", body.birthday.date);
        
      start();
    });
    
    req.fail(function (response) {
      that.fail("response was not parsed");
      
      start();
    });
  });
  
  /*
   * better: returns the response code
   *
   * but this would need to mock jquery.formSubmit()
   *
   * we cannot simulate a 400 response with the server (yet) look at: http://www.senchalabs.org/connect/
   */
  /*
  asyncTest("sendsAndGetsValidationForm", function() {
    var that = setup(this);

    var $form = $(html);
    
    var ajaxFormHandler = new Psc.AjaxFormHandler();
    var formRequest = new Psc.FormRequest({form: $form});
    var req = ajaxFormHandler.handle(formRequest);
    
    req.fail(function (response) {
      that.assertInstanceOf(Psc.Response, response);
      that.assertEquals(400, response.getCode());
      that.assertTrue(response.isValidation());
      
      start();
    });
  });
  */


  asyncTest("debug conversion error", function() {
    var that = setup(this), url;
    var $form = $(html);
    
    var ajaxFormHandler = new Psc.AjaxFormHandler();
    var formRequest = new Psc.FormRequest({form: $form});
    formRequest.setUrl(
      url = require.toUrl('fixtures/response.damage.json')
    ).setMethod('GET');

    var req = ajaxFormHandler.handle(formRequest);
    
    req.fail(function (exception) {
      that.assertInstanceOf(Psc.Exception, exception);
      that.assertEquals(1, exception.getMessage().match(/Fatal error: Call to undefined function blubb\(\)/).length);
      
      start();
    });
    
    req.done(function (response) {
      that.fail("done is not valid for damaged json to be resolved");
      
      start();
    });
  });
});