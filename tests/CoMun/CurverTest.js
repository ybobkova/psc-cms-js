define(['CoMun/Curver','Psc/Test/DoublesManager'], function() {
  
  module("CoMun.Curver");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var curver = new CoMun.Curver({ });
    
    return {curver: curver};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.curver.doSomething();
  });
});