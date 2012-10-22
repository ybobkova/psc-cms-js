define(['Psc/Request'], function () {
  module("Psc.Request");
  
  test("construct", function() {
    var request = new Psc.Request({
      url: '/entities/person/12/form',
      method: 'PUT'
    });
    
    assertEquals('/entities/person/12/form', request.getUrl());
    
    assertException("Psc.WrongValueException", function () {
      request.setFormat('blubb')
    });
  
    assertException("Psc.WrongValueException", function () {
      request.setMethod('PUD')
    });
  });
  
  test("bodyConstruct", function () {
    var request = new Psc.Request({
      url: '/echo/',
      method: 'POST',
      format: 'html',
      body: 'not empty'
    });
    
    assertEquals('not empty',request.getBody());
    assertEquals(null, request.getHeaderField('X-Psc-Cms-Request-Method'));
    assertEquals('POST',request.getMethod());
  });
  
  test("headerIsEmptyAtStart", function () {
    var request = new Psc.Request({
      url: '/entities/person/12/form',
      method: 'POST'
    });
    
    assertEmptyObject(request.getHeader());
    assertEquals(null, request.getHeaderField('Content-Type'));
  });
  
  test("requestGetsandSetsHeaderFields", function() {
    var request = new Psc.Request({
      url: '/entities/person/12/form',
      method: 'POST'
    });
    
    assertEquals(null, request.getHeaderField('Content-Type'));
    request.setHeaderField('Content-Type', 'text/html');
    assertEquals('text/html', request.getHeaderField('Content-Type'));
    request.removeHeaderField('Content-Type');
    assertEquals(null, request.getHeaderField('Content-Type'));
  });
  
  test("setMethodSetsXRequestMethodHeader", function() {
    var request = new Psc.Request({
      url: '/entities/person/12/form',
      method: 'PUT'
    });
    var xHeader = 'X-Psc-Cms-Request-Method';
  
    // initialize sets it
    assertEquals('PUT', request.getHeaderField(xHeader));
  });

  
  test("cleans QuestionMark in URL when GET Request", function () {
    var request = new Psc.Request({
      url: '/entities/search/?',
      method: 'GET'
    });
    
    assertEquals('/entities/search/',request.getUrl());
  });
  
  
  test("handles null values for jquery param serializiation", function () {
    expect(0);
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
    
    console.log(request.getBody());
    
    console.log(JSON.stringify(request.getBody()));
  });
  
});