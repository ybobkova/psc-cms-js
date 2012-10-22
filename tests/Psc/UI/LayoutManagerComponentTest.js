define(['psc-tests-assert','Psc/UI/LayoutManagerComponent'], function() {
  
  module("Psc.UI.LayoutManagerComponent");
  
  var setup = function () {
    var layoutManagerComponent = new Psc.UI.LayoutManagerComponent({ });
    
    return {layoutManagerComponent: layoutManagerComponent};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.layoutManagerComponent.doSomething();
  });
});