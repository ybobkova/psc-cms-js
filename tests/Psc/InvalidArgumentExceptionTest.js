define(['psc-tests-assert',"Psc/InvalidArgumentException"], function () {
  module("Psc.InvalidArgumentException");

  test("construct", function() {
    var e = new Psc.InvalidArgumentException('method','POST|GET|DELETE|PUT');
  
    this.assertEquals("Psc.InvalidArgumentException", e.getName());
    this.assertEquals("method", e.getArg());
    this.assertEquals("POST|GET|DELETE|PUT", e.getExpected());
    this.assertEquals("[Psc.InvalidArgumentException with Message 'Falscher Parameter für Argument: 'method'. Erwartet wird: POST|GET|DELETE|PUT']", e.toString());
  });
  
  test("backtrace", function () {
    expect(0);
    var e = new Psc.InvalidArgumentException('method','POST|GET|DELETE|PUT');
  });
});