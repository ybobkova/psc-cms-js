define(['psc-tests-assert','Psc/UI/Group'], function(t) {
  
  module("Psc.UI.Group");
  
  var setup = function(test) {
    var group = new Psc.UI.Group({ });
    
    return t.setup(test, {group: group});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.group.doSomething();
  });
});