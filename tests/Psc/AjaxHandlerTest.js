use(['Psc.AjaxHandler', 'Psc.Request'], function () {
  module("Psc.AjaxHandler", {
    setup: function () {
      this.ajaxHandler = new Psc.AjaxHandler();
      this.request404 = new Psc.Request({
       url: '/js/fixtures/ajax/http.404.php',
        method: 'PUT'
      });
      
      this.request200 = new Psc.Request({
        url: '/js/fixtures/ajax/http.echo.php',
        body: {
          content: 'delivered body',
          headers: { 'X-Test-Header': '1'}
        },
        method: 'POST',
        format: 'html'
      });
      
      this.request400Validation = new Psc.Request({
        url: '/js/fixtures/ajax/http.echo.php',
        body: {
          content: '400 validation body',
          code: 400,
          headers: { 'X-Psc-Cms-Validation': 'true' }
        },
        method: 'POST',
        format: 'html'
      });
    }
  });
  
  asyncTest("HandlerCallsRejectOn404Error", function() {
    var req = this.ajaxHandler.handle(this.request404);
    
    req.fail(function(response) {
      assertInstanceOf(Psc.Response, response);
      assertEquals(404, response.getCode());
      assertEquals("Dies ist ein 404 TestFehler (Seite nicht gefunden)", response.getBody());
      
      start();
    });
    
    req.done(function() {
      fail('done is called');
      start();
    });
  });
  
  asyncTest("400ValidationRejectsPromise_isValidation", function() {
    var req = this.ajaxHandler.handle(this.request400Validation);
    
    req.fail(function(response) {
      assertInstanceOf(Psc.Response, response);
      assertEquals(400, response.getCode());
      assertEquals("400 validation body", response.getBody());
      assertTrue(response.isValidation());
      
      start();
    });
    
    req.done(function(response) {
      fail('handler calls done instead of fail');
      
      start();
    });
  });
  
  asyncTest("200hasCodehasBodyhasHeader", function() {
    var req = this.ajaxHandler.handle(this.request200);
    
    req.done(function(response) {
      assertInstanceOf(Psc.Response, response);
      assertEquals(200, response.getCode());
      assertEquals("delivered body", response.getBody());
      assertFalse(response.isValidation());
      assertEquals('1', response.getHeaderField('X-Test-Header'),'X-Test-Header is equal to 1');
      
      start();
    });
  });
  
  
  asyncTest("testBodyAsJSONPosting", function() {
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
      assertEquals(request.getBody(), response.getBody());
      start();
    });
    
    status.fail(function (response) {
      console.log(response);
      fail("request has failed");
      start();
    });
  });
  
});