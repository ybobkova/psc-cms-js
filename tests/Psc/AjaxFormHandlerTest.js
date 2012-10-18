use(['Psc.AjaxFormHandler','Psc.FormRequest','Psc.Exception'], function () {

  module("Psc.AjaxFormHandler");

  asyncTest("sendsAndGetsForm", function() {
    $.get('/js/fixtures/form.html', function (html) {
      var $form = $(html);
      
      var ajaxFormHandler = new Psc.AjaxFormHandler();
      var formRequest = new Psc.FormRequest({form: $form});
      var req = ajaxFormHandler.handle(formRequest);
      
      req.done(function (response) { // responste sollte http.form.saved.php sein
        assertInstanceOf(Psc.Response, response);
        assertEquals(200,response.getCode());
        var body = response.getBody();
        assertEquals(2,body.id);
        assertFalse(body.yearKnown);
        assertEquals("5698800", body.birthday.date);
        
        start();
      });
    });
  });
  
  asyncTest("sendsAndGetsValidationForm", function() {
    $.get('/js/fixtures/form.error.validation.html', function (html) {
      var $form = $(html);
      
      var ajaxFormHandler = new Psc.AjaxFormHandler();
      var formRequest = new Psc.FormRequest({form: $form});
      var req = ajaxFormHandler.handle(formRequest);
      
      req.fail(function (response) { // responste sollte http.form.saved.php sein
        assertInstanceOf(Psc.Response, response);
        assertEquals(400,response.getCode());
        assertTrue(response.isValidation());
        
        start();
      });
    });
  });


  asyncTest("debug conversion error", function() {
    $.get('/js/fixtures/form.error.validation.html', function (html) {
      var $form = $(html);
      
      $form.find('form').attr('action', '/js/fixtures/ajax/http.damage.php');
      
      var ajaxFormHandler = new Psc.AjaxFormHandler();
      var formRequest = new Psc.FormRequest({form: $form});
      var req = ajaxFormHandler.handle(formRequest);
      
      req.fail(function (exception) {
        assertInstanceOf(Psc.Exception, exception);
        
        assertEquals(1, exception.getMessage().match(/Fatal error: Call to undefined function blubb\(\)/).length);
        
        start();
      });
      
      req.done(function (response) {
        fail("done is not valid for damaged php to be resolved");
        start();
      });
    });
  });
});