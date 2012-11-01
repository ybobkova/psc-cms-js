define(['psc-tests-assert','text!fixtures/datetimepicker.html', 'Psc/UI/DateTimePicker','Psc/Test/DoublesManager'], function(t, html) {

  module("Psc.UI.DateTimePicker");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var $widget = t.visibleFixture(html);
    
    var datePicker = new Psc.UI.DateTimePicker({
      dateFormat: 'd.m.Y',
      timeFormat: 'h:i',
      widget: $widget
    });
    
    t.setup(test, {datePicker: datePicker, $widget: $widget});
  };

  test("acceptance", function() {
    setup(this);
    this.assertTrue(true, 'yep its running');
  
    // this.datePicker.doSomething();
  });
});
