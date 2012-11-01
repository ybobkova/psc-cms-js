define(['psc-tests-assert','Psc/UI/DatePicker','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.DatePicker");
  
  var setup = function() {
    //var dm = new Psc.Test.DoublesManager();
    var datePicker = new Psc.UI.DatePicker({ });
    
    return t.setup(test, {datePicker: datePicker});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.datePicker.doSomething();
  });
});