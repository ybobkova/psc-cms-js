define(['psc-tests-assert','Psc/Response'], function (t) {
  module("Psc.Response");
  
  var setup = function (test) {
    return t.setup(test, {
      headerString: "Date: Mon, 19 Mar 2012 06:48:32 GMT\r\nServer: Apache/2.2.22 (Win32) PHP/5.3.10\r\nX-Powered-By: PHP/5.3.10\r\nPragma: no-cache\r\nCache-Control: private, no-cache\r\nVary: Accept\r\nContent-Length: 50\r\nKeep-Alive: timeout=5, max=91\r\nConnection: Keep-Alive\r\nContent-Type: text/html; charset=utf-8\r"
    });
  };
  
  test("construct", function() {
    setup(this);
    var response = new Psc.Response({code: 200, reason: 'OK'});
    
    this.assertEquals(200, response.getCode());
    this.assertEquals('OK', response.getReason());
    this.assertEmptyObject(response.getHeader());
    
    this.assertInstanceOf(Psc.Response, response);
  });
  
  test("convertsCodeToInt", function() {
    setup(this);
    var response = new Psc.Response({code: "200", reason: 'OK'});
    
    this.assertEquals(200, response.getCode());
  });
  
  test("parsesStringHeader", function() {
    setup(this);
    var response = new Psc.Response({
      code: 200,
      reason: 'OK',
      headers: this.headerString
    });
    
    
    this.assertEquals("text/html; charset=utf-8", response.getHeaderField('Content-Type'));
    this.assertEquals("no-cache", response.getHeaderField('Pragma'));
    
    // sets to null
    response.setHeaderField('Content-Type', null);
    this.assertEquals(null, response.getHeaderField('Content-Type'));
    
    // removes
    response.removeHeaderField('Pragma');
    this.assertEquals(null, response.getHeaderField('Pragma'));
  });
});