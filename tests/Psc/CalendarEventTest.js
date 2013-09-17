define(['psc-tests-assert','Psc/CalendarEvent','Psc/Date', 'Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.CalendarEvent");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var calendarEvent = new Psc.CalendarEvent({
      i18nTitle: {de: 'Calendar Event Test'},
      start: Psc.Date.create({year: 2012, month: 9, day: 1}),
      end: Psc.Date.create({year: 2012, month: 9, day: 4})
    });
    
    t.setup(test, {calendarEvent: calendarEvent});
  };

  test("acceptance", function() {
    setup(this);
  
    var days = '';
    $.each(this.calendarEvent.getDays(), function() {
      days += this.format('$d.m. ');
    });
    this.assertEquals("1.9. 2.9. 3.9. 4.9. ", days);
  });
  
  test("todo: formatRange tests", function () {
    setup(this);
    this.assertTrue(true, "the acceptance test is passed");
  });
});