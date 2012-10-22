define(['Psc/UI/SplitPane'], function() {
  
  module("Psc.UI.SplitPane");
  
  var setup = function () {
    var splitPane = new Psc.UI.SplitPane({ });
    
    return {splitPane: splitPane};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.splitPane.doSomething();
  });
});