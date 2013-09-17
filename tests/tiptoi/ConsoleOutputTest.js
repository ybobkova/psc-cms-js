define(['psc-tests-assert','Psc/EventManager','tiptoi/ConsoleOutput'], function(t) {
  
  module("tiptoi.ConsoleOutput");
  
  var setup = function(test) {
    return t.setup(test);
  };

  test("acceptance", function() {
    setup(this);
    
    var consoleOutput = new tiptoi.ConsoleOutput({
      eventManager: new Psc.EventManager({})
    });

    this.assertTrue(true, "the test is passed");
  });
});