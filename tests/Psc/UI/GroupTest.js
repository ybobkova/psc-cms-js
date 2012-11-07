define(['psc-tests-assert','Psc/UI/Group'], function(t) {
  
  module("Psc.UI.Group");
  
  var setup = function(test) {
    var group = new Psc.UI.Group({
      label: 'empty'
    });
    
    return t.setup(test, {group: group});
  };

  test("acceptance", function() {
    setup(this);
  
    this.assertEquals(1, this.group.html().length);
  });
});