define(['psc-tests-assert','Psc/Request'], function (t) {
  
  module("Psc.Request");
  
  var setup = function(test) {
    return t.setup(test);
  };
  
  test("construct", function() {
    setup(this);
    var request = new Psc.Request({
      url: '/entities/person/12/form',
      method: 'PUT'
    });
    
    this.assertEquals('/entities/person/12/form', request.getUrl());
    
    this.assertException("Psc.WrongValueException", function () {
      request.setFormat('blubb');
    });
  
    this.assertException("Psc.WrongValueException", function () {
      request.setMethod('PUD');
    });
  });
  
  test("bodyConstruct", function () {
    setup(this);
    var request = new Psc.Request({
      url: '/echo/',
      method: 'POST',
      format: 'html',
      body: 'not empty'
    });
    
    this.assertEquals('not empty',request.getBody());
    this.assertEquals(null, request.getHeaderField('X-Psc-Cms-Request-Method'));
    this.assertEquals('POST',request.getMethod());
  });
  
  test("headerIsEmptyAtStart", function () {
    setup(this);
    var request = new Psc.Request({
      url: '/entities/person/12/form',
      method: 'POST'
    });
    
    this.assertEmptyObject(request.getHeader());
    this.assertEquals(null, request.getHeaderField('Content-Type'));
  });
  
  test("requestGetsandSetsHeaderFields", function() {
    setup(this);
    var request = new Psc.Request({
      url: '/entities/person/12/form',
      method: 'POST'
    });
    
    this.assertEquals(null, request.getHeaderField('Content-Type'));
    request.setHeaderField('Content-Type', 'text/html');
    this.assertEquals('text/html', request.getHeaderField('Content-Type'));
    request.removeHeaderField('Content-Type');
    this.assertEquals(null, request.getHeaderField('Content-Type'));
  });
  
  test("setMethodSetsXRequestMethodHeader", function() {
    setup(this);
    var request = new Psc.Request({
      url: '/entities/person/12/form',
      method: 'PUT'
    });
    var xHeader = 'X-Psc-Cms-Request-Method';
  
    // initialize sets it
    this.assertEquals('PUT', request.getHeaderField(xHeader));
  });

  
  test("cleans QuestionMark in URL when GET Request", function () {
    setup(this);
    var request = new Psc.Request({
      url: '/entities/search/?',
      method: 'GET'
    });
    
    this.assertEquals('/entities/search/',request.getUrl());
  });
  
  
  test("handles null values for jquery param serializiation", function () {
    setup(this);

    var body = {
          table: [
            [null, "Finde die Fußspur des g...le Abdrücke im Bild an.", "GAME-4-002"],
            [null, "Das war nicht richtig!", "GAME-4-011"],
            [null, "Sieh dir noch einmal in...inmal spielen möchtest.", "GAME-4-012"],
            [null, "Probiere es noch einmal", "GAME-4-013"],
            [null, "Bitte berühre einen Fussabdruck", "GAME-4-014"]
           ]
        };
    
    var request = new Psc.Request({
      body: body,
      url: '/does/not/matter',
      method: 'POST',
      format: 'json'
    });

    
    this.assertTrue(true, "the test is passed");
  });
});