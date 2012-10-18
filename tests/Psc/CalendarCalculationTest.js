use(['Psc.CalendarCalculation','Psc.Date','Psc.Test.DoublesManager'], function() {
  
  module("Psc.CalendarCalculation");
  
  var setup = function () {
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
    
    
    return {calendarCalculation: calendarCalculation, daysToNum: daysToNum};
  };

  test("checkMonthRowsDays for sep 2012", function() {
    $.extend(this, setup());
  
    var mr = this.calendarCalculation.monthRows;
    assertEquals([27,28,29,30,31,1,2], this.daysToNum(mr[0].days));
    assertEquals([3,4,5,6,7,8,9], this.daysToNum(mr[1].days));
    assertEquals([10,11,12,13,14,15,16], this.daysToNum(mr[2].days));
    assertEquals([17,18,19,20,21,22,23], this.daysToNum(mr[3].days));
    assertEquals([24,25,26,27,28,29,30], this.daysToNum(mr[4].days));
  });
  
  test("checkMonthRowsDays for feb 2012", function() {
    $.extend(this, setup());
    this.calendarCalculation.setDate(new Psc.Date.create({year: 2012, day: 1, month: 2}));
    
    var mr = this.calendarCalculation.monthRows;
    assertEquals([30,31,1,2,3,4,5], this.daysToNum(mr[0].days));
    assertEquals([6,7,8,9,10,11,12], this.daysToNum(mr[1].days));
    assertEquals([13,14,15,16,17,18,19], this.daysToNum(mr[2].days));
    assertEquals([20,21,22,23,24,25,26], this.daysToNum(mr[3].days));
    assertEquals([27,28,29,1,2,3,4], this.daysToNum(mr[4].days));
  });
});