define(['psc-tests-assert','Psc/UI/DatePicker','Psc/Test/DoublesManager'], function() {
  
  module("Psc.UI.DatePicker");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var datePicker = new Psc.UI.DatePicker({ });
    
    return {datePicker: datePicker};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.datePicker.doSomething();
  });
});