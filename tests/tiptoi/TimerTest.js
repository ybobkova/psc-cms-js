define(['psc-tests-assert','tiptoi/Timer'], function(t) {
  
  module("tiptoi.Timer");
  
  var setup = function(test) {
    var timer = new tiptoi.Timer({
      seconds: 1
    });
    
    return t.setup(test, {timer: timer});
  };

/*  
  asyncTest("something other here before", function () {
    var that = setup(this);
    expect(0);
    
    start();
  });
  */
  
  asyncTest("timer has runout when no stop is called", function() {
    var that = setup(this);
    var runout = false;
    
    this.timer.start();
    this.timer.hasRunOut(function () {
      runout = true;
    });
    
    setTimeout(function () {
      that.assertTrue(runout);
      
      start();
    }, 1010);
  });

  asyncTest("timer has not runout when stop is called", function() {
    var that = setup(this);
    
    var runout = false;
    
    this.timer.start();
    this.timer.hasRunOut(function () {
      runout = true;
    });
    
    setTimeout(function () {
      that.timer.stop();
    }, 500);
    
    setTimeout(function () {
      that.assertFalse(runout);
      
      start();
    }, 1010);
    
  });
});