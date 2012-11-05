define(['psc-tests-assert','Psc/UI/SplitPane'], function(t) {
  
  module("Psc.UI.SplitPane");
  
  var setup = function(test) {
    var splitPane = new Psc.UI.SplitPane({ });
    
    return t.setup(test, {splitPane: splitPane});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.splitPane.doSomething();
  });
});