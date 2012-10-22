define(['tiptoi/Timer'], function() {
  
  module("tiptoi.Timer");
  
  var setup = function () {
    var timer = new tiptoi.Timer({ });
    
    return {timer: timer};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.timer.doSomething();
  });
});