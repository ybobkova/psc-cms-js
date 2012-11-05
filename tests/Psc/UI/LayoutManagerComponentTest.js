define(['psc-tests-assert','Psc/UI/LayoutManagerComponent'], function(t) {
  
  module("Psc.UI.LayoutManagerComponent");
  
  var setup = function(test) {
    var layoutManagerComponent = new Psc.UI.LayoutManagerComponent({ });
    
    return t.setup(test, {layoutManagerComponent: layoutManagerComponent});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.layoutManagerComponent.doSomething();
  });
});