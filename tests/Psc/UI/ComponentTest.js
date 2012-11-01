define(['psc-tests-assert','Psc/UI/Component'], function(t) {
  
  module("Psc.UI.Component");
  
  var setup = function(test) {
    var component = new Psc.UI.Component({ });
    
    return t.setup(test, {component: component});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.component.doSomething();
  });
});