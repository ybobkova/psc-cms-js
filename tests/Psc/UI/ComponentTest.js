define(['Psc/UI/Component'], function() {
  
  module("Psc.UI.Component");
  
  var setup = function () {
    var component = new Psc.UI.Component({ });
    
    return {component: component};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.component.doSomething();
  });
});