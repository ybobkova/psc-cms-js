define(['psc-tests-assert','Psc/WrongValueException'], function (t) {
  
  module("Psc.WrongValueException");
  
  test("construct", function() {
    t.setup(this);
    var e = new Psc.WrongValueException('Wert: xyz nicht erlaubt. Erlaubt sind nur abc');
    
    this.assertEquals("Psc.WrongValueException", e.getName());
    this.assertEquals('Wert: xyz nicht erlaubt. Erlaubt sind nur abc', e.getMessage());
  });
});