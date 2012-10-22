define(['psc-tests-assert','CoMun/CalendarEvent','Psc/Test/DoublesManager', 'Psc/Date'], function(t) {
  
  module("CoMun.CalendarEvent");
  
  var setup = function (test) {
    
    
    //var dm = new Psc.Test.DoublesManager();
    var calendarEvent = new CoMun.CalendarEvent({
      region: 'de',
      i18nTitle: {
        de: 'german event',
        en: 'english event'
      },
      start: new Psc.Date()
    });
    
    t.setup(test, {calendarEvent: calendarEvent});
  };

  test("acceptance", function() {
    setup(this);
  
    this.assertEquals('german event', this.calendarEvent.getTitle());
  });
});