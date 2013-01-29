define(['psc-tests-assert',"Psc/InvalidArgumentException"], function (t) {
  
  module("Psc.InvalidArgumentException");
  
  var setup = function (test) {
    return t.setup(test);
  };

  test("construct", function() {
    var that = setup(this);
    var e = new Psc.InvalidArgumentException('method','POST|GET|DELETE|PUT');
  
    this.assertEquals("Psc.InvalidArgumentException", e.getName());
    this.assertEquals("method", e.getArg());
    this.assertEquals("POST|GET|DELETE|PUT", e.getExpected());
    this.assertContains("[Psc.InvalidArgumentException with Message 'Falscher Parameter für Argument: 'method'. Erwartet wird: POST|GET|DELETE|PUT']", e.toString());
  });
});