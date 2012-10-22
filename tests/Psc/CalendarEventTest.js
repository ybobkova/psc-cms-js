define(['Psc/CalendarEvent','Psc/Date', 'Psc/Test/DoublesManager'], function() {
  
  module("Psc.CalendarEvent");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var calendarEvent = new Psc.CalendarEvent({
      title: 'Calendar Event Test',
      start: Psc.Date.create({year: 2012, month: 9, day: 1}),
      end: Psc.Date.create({year: 2012, month: 9, day: 4})
    });
    
    $.extend(test, {calendarEvent: calendarEvent});
  };

  test("acceptance", function() {
    setup(this);
  
    var days = '';
    $.each(this.calendarEvent.getDays(), function() {
      days += this.format('$d.m. ');
    });
    assertEquals("1.9. 2.9. 3.9. 4.9. ", days);
  });
});