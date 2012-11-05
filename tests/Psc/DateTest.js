define(['psc-tests-assert','Psc/Date','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.Date");
  
  var setup = function (test) {
    var nativeDate = new Date();
    var date = new Psc.Date({date: nativeDate}); // damit wir in sync sind
    var currentDate = new Psc.Date();

    var ret = {
      date: date,
      nativeDate: nativeDate,
      currentDate: currentDate,
      assertDateEquals: function (expectedDate, actualDate, withTime) {
        if (withTime) {
          this.assertTrue(expectedDate.equals(actualDate), expectedDate+' equals exactly '+actualDate);
        } else {
          this.assertTrue(expectedDate.equals(actualDate), expectedDate+' equals '+actualDate);
        }
      }
    };
    
    return t.setup(test, ret);
  };

  test("without parameter it is the current date", function() {
    setup(this);
    
    this.assertEquals(this.nativeDate.getDate()+'.'+(this.nativeDate.getMonth()+1)+'.'+this.nativeDate.getFullYear(), this.currentDate.format('$d.m.yy'));
  });
  
  test("our date has not a 0 based month index and gives a full year", function () {
    setup(this);
    
    this.assertEquals(this.nativeDate.getMonth()+1, this.date.getMonth());
    this.assertEquals(this.nativeDate.getFullYear(), this.date.getYear());
  });
  
  test("addDate adds a Date to the currentDate", function () {
    setup(this);

    var now = Psc.Date.create({ day: 17,  month: 9, year: 2012 });
    var copy = now.add({});
    var addedMonth = now.add({months: 1});
    var addedYearMonth = now.add({months: 1, years: 1});
    var endAugust = Psc.Date.create({ day: 31,  month: 8, year: 2012 });
    var beginSep = Psc.Date.create({ day: 1,  month: 9, year: 2012 });
    
    this.assertEquals('17.9.2012', now.format('$d.m.yy'));
    this.assertEquals('17.9.2012', copy.format('$d.m.yy'));
    this.assertEquals('17.10.2012', addedMonth.format('$d.m.yy'));
    this.assertEquals('17.10.2013', addedYearMonth.format('$d.m.yy'));
    this.assertEquals('26.8.2012', endAugust.add({days: -5}).format('$d.m.yy'));
    this.assertEquals('27.8.2012', beginSep.add({days: -5}).format('$d.m.yy'));
  });
  
  test("equalsDate equals in Date", function () {
    setup(this);

    var date1 = Psc.Date.create({ day: 17,  month: 9, year: 2012, hours: 11 }),
        date2 = Psc.Date.create({ day: 17,  month: 9, year: 2012, hours: 12 });
        
    this.assertTrue(date1.equalsDate(date2));
  });
  
  test("getFirstDayOfMonth / getLastDayOfMonth", function () {
    setup(this);
    var sep = Psc.Date.create({ day: 17,  month: 9, year: 2012 });
    var feb = Psc.Date.create({ day: 2,  month: 2, year: 2012 });
    
    this.assertEquals('1.9.2012', sep.getFirstDayOfMonth().format('$d.m.yy'));
    this.assertEquals('30.9.2012', sep.getLastDayOfMonth().format('$d.m.yy'));
    this.assertEquals('29.2.2012', feb.getLastDayOfMonth().format('$d.m.yy'));
    this.assertEquals('1.2.2012', feb.getFirstDayOfMonth().format('$d.m.yy'));
  });
  
  test("date can format the time", function () {
    setup(this);
    this.assertEquals('13:35:50',
                 (new Psc.Date({date: new Date(2012, 1 - 1, 1, 13, 35, 50)})).format('$hh:ii:ss'),
                 'Format date hh:ii:ss'
                 );
   this.assertEquals('01:9:1',
                 (new Psc.Date({date: new Date(2012, 1 - 1, 1, 1, 9, 1)})).format('$hh:i:s'),
                 'Format date hh:i:s'
                );
   this.assertEquals('1:9:1',
                 (new Psc.Date({date: new Date(2012, 1 - 1, 1, 1, 9, 1)})).format('$h:i:s'),
                 'Format date h:i:s'
                );
   this.assertEquals('1.1.2012 14:09:01',
                 (new Psc.Date({date: new Date(2012, 1 - 1, 1, 14, 9, 1)})).format('$d.m.yy hh:ii:ss'),
                 'Format date d.m.yy hh:ii:ss'
                );
  });
  
  test("copy copies exactly", function () {
    setup(this);
    var me = new Psc.Date();
    var copy = me.copy();
    
    this.assertTrue(me.equals(copy));
  });
  
  test("Date.create can create AjaxFormat of Psc.DateTime.DateTime ", function () {
    setup(this);
    
    var date = Psc.Date.create({
      'date': "1353279600",
      'timezone': "Europe/Berlin"}
    );
    var expectedDate = Psc.Date.create({year: 2012, month: 11, day: 19});
    
    this.assertDateEquals(expectedDate, date);
  });
});