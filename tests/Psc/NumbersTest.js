define(['psc-tests-assert','Psc/Numbers'], function(t) {
  
  var setup = function (test) {
    return t.setup(test);
  };
  
  module("Psc.Numbers");

  test("acceptance", function() {
    var r;
    for (var i = 1; i <= 120; i++) {
      r = Psc.Numbers.randomInt(-1,100)
      this.assertTrue(r >= -1 && r <= 100, ''+r+' is in range');
    }
  });
});