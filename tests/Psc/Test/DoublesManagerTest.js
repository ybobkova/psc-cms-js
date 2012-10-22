define(['psc-tests-assert','Psc/Test/DoublesManager'], function() {
  
  module("Psc.Test.DoublesManager");
  
  var setup = function () {
    var doublesManager = new Psc.Test.DoublesManager({ });
    
    return {doublesManager: doublesManager};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.doublesManager.doSomething();
  });
});