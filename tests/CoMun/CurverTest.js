define(['psc-tests-assert','CoMun/Curver','Psc/Test/DoublesManager'], function(t) {
  
  module("CoMun.Curver");
  
  var setup = function (test) {
    var $widget = $();
    
    //var dm = new Psc.Test.DoublesManager();
    var curver = new CoMun.Curver({
      widget: $widget
    });
    
    return t.setup(test, {curver: curver});
  };

  test("acceptance", function() {

    setup(this);
  
    // this.curver.doSomething();

    this.assertTrue(true, "Curver acceptance test is passed");
  });
});