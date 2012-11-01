define(['psc-tests-assert','Psc/UI/LayoutManagerComponent'], function(t) {
  
  module("Psc.UI.LayoutManagerComponent");
  
  var setup = function () {
    var layoutManagerComponent = new Psc.UI.LayoutManagerComponent({ });
    
    return {layoutManagerComponent: layoutManagerComponent};
  };

  test("acceptance", function() {
    setup(this);
  
    // this.layoutManagerComponent.doSomething();
  });
});