define(['CoMun/CalendarEvent','Psc/Test/DoublesManager'], function() {
  
  module("CoMun.CalendarEvent");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var calendarEvent = new CoMun.CalendarEvent({ });
    
    $.extend(test, {calendarEvent: calendarEvent});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.calendarEvent.doSomething();
  });
});