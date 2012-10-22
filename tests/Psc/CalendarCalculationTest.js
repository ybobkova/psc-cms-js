define(['psc-tests-assert','Psc/CalendarCalculation','Psc/Date','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.CalendarCalculation");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var calendarCalculation = new Psc.CalendarCalculation({
      date: new Psc.Date.create({year: 2012, day: 18, month: 9}),
      region: 'de'
    });
    var daysToNum = function(days) {
      var nums = [];
      $.each(days, function(i, day) {
        nums.push(day.getDay());
      });
      return nums;
    };
    
    
    return t.setup(test, {calendarCalculation: calendarCalculation, daysToNum: daysToNum});
  };

  test("checkMonthRowsDays for sep 2012", function() {
    setup(this);
  
    var mr = this.calendarCalculation.monthRows;
    this.assertEquals([27,28,29,30,31,1,2], this.daysToNum(mr[0].days));
    this.assertEquals([3,4,5,6,7,8,9], this.daysToNum(mr[1].days));
    this.assertEquals([10,11,12,13,14,15,16], this.daysToNum(mr[2].days));
    this.assertEquals([17,18,19,20,21,22,23], this.daysToNum(mr[3].days));
    this.assertEquals([24,25,26,27,28,29,30], this.daysToNum(mr[4].days));
  });
  
  test("checkMonthRowsDays for feb 2012", function() {
    setup(this);
    this.calendarCalculation.setDate(new Psc.Date.create({year: 2012, day: 1, month: 2}));
    
    var mr = this.calendarCalculation.monthRows;
    this.assertEquals([30,31,1,2,3,4,5], this.daysToNum(mr[0].days));
    this.assertEquals([6,7,8,9,10,11,12], this.daysToNum(mr[1].days));
    this.assertEquals([13,14,15,16,17,18,19], this.daysToNum(mr[2].days));
    this.assertEquals([20,21,22,23,24,25,26], this.daysToNum(mr[3].days));
    this.assertEquals([27,28,29,1,2,3,4], this.daysToNum(mr[4].days));
  });
});