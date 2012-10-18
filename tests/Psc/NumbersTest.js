use(['Psc.Numbers'], function() {
  
  module("Psc.Numbers", {
    setup: function () {
      
    }
  });

  test("acceptance", function() {
    var r;
    for (var i = 1; i <= 120; i++) {
      r = Psc.Numbers.randomInt(-1,100)
      assertTrue(r >= -1 && r <= 100, ''+r+' is in range');
    }
  });
});