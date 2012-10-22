define(['Psc/UI/Group'], function() {
  
  module("Psc.UI.Group");
  
  var setup = function () {
    var group = new Psc.UI.Group({ });
    
    return {group: group};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.group.doSomething();
  });
});