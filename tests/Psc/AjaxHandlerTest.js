define(['psc-tests-assert','Psc/AjaxHandler', 'Psc/Request'], function (t) {
  module("Psc.AjaxHandler");
    
  var setup = function (test) {
      test.ajaxHandler = new Psc.AjaxHandler();
      test.request404 = new Psc.Request({
        url: '/somethingthatdoesnotexist',
        method: 'GET'
      });
      
      test.request200 = new Psc.Request({
        url: '/js/fixtures/ajax/http.echo.php',
        body: {
          content: 'delivered body',
          headers: { 'X-Test-Header': '1'}
        },
        method: 'POST',
        format: 'html'
      });
      
      test.request400Validation = new Psc.Request({
        url: '/js/fixtures/ajax/http.echo.php',
        body: {
          content: '400 validation body',
          code: 400,
          headers: { 'X-Psc-Cms-Validation': 'true' }
        },
        method: 'POST',
        format: 'html'
      });
      
      return t.setup(test);
  };
  
  asyncTest("HandlerCallsRejectOn404Error", function() {
    var that = setup(this);
    var req = this.ajaxHandler.handle(this.request404);
    
    req.fail(function(response) {
      that.assertInstanceOf(Psc.Response, response);
      that.assertEquals(404, response.getCode());
      
      start();
    });
    
    req.done(function() {
      fail('done is called');
      start();
    });
  });
  
  /*
   * not possible because cannot send headers and code in 404

  asyncTest("400ValidationRejectsPromise_isValidation", function() {
    var that = setup(this);
    var req = this.ajaxHandler.handle(this.request400Validation);
    
    req.fail(function(response) {
      that.assertInstanceOf(Psc.Response, response);
      that.assertEquals(400, response.getCode());
      that.assertEquals("400 validation body", response.getBody());
      that.assertTrue(response.isValidation());
      
      start();
    });
    
    req.done(function(response) {
      fail('handler calls done instead of fail');
      
      start();
    });
  });
  
  asyncTest("200hasCodehasBodyhasHeader", function() {
    var that = setup(this);
    var req = this.ajaxHandler.handle(this.request200);
    
    req.done(function(response) {
      that.assertInstanceOf(Psc.Response, response);
      that.assertEquals(200, response.getCode());
      that.assertEquals("delivered body", response.getBody());
      that.assertFalse(response.isValidation());
      that.assertEquals('1', response.getHeaderField('X-Test-Header'),'X-Test-Header is equal to 1');
      
      start();
    });
  });
  */
  
  /* same here: this is not possible
   *
  asyncTest("testBodyAsJSONPosting", function() {
    var that = setup(this);
    var ajaxHandler = new Psc.AjaxHandler();
    var request = new Psc.Request({
      url: '/js/fixtures/ajax/http.echo.json.php',
      method: 'PUT',
      sendAs: 'json', // benutzt json als body und converted body mit stringify
      format: 'json',
      body: {
        table: [
            [null, "Finde die Fußspur des g...le Abdrücke im Bild an.", "GAME-4-002"],
            [null, "Das war nicht richtig!", "GAME-4-011"],
            [null, "Sieh dir noch einmal in...inmal spielen möchtest.", "GAME-4-012"],
            [null, "Probiere es noch einmal", "GAME-4-013"],
            [null, "Bitte berühre einen Fussabdruck", "GAME-4-014"]
           ]
      }
    });
    
    var status = ajaxHandler.handle(request);
    
    status.done(function (response) {
      this.assertEquals(request.getBody(), response.getBody());
      start();
    });
    
    status.fail(function (response) {
      console.log(response);
      fail("request has failed");
      start();
    });
  });
  
  */
});