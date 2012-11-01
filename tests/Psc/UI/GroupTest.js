define(['psc-tests-assert','Psc/UI/Group'], function(t) {
  
  module("Psc.UI.Group");
  
  var setup = function () {
    var group = new Psc.UI.Group({ });
    
    return {group: group};
  };

  test("acceptance", function() {
    setup(this);
  
    // this.group.doSomething();
  });
});