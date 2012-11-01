define(['psc-tests-assert','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.Test.DoublesManager");
  
  var setup = function(test) {
    var doublesManager = new Psc.Test.DoublesManager({ });
    
    return t.setup(test, {doublesManager: doublesManager});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.doublesManager.doSomething();
  });
});