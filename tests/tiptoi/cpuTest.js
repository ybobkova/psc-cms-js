define(['psc-tests-assert','tiptoi/cpu','tiptoi/InputProvider','tiptoi/Timer'], function() {
  
  module("tiptoi.cpu");
  
  var setup = function (sequence, delay) {
    if (!sequence) sequence = [];
    if (!delay) delay = 300;
    
    var cpu = new tiptoi.cpu({
      inputProvider: new tiptoi.InputProvider({
        sequence: sequence,
        delay: delay
      })
    });
    
    return {cpu: cpu};
  };

  asyncTest("cpu starts a timer", function () {
    $.extend(this, setup());
    
    var timer = this.cpu.startTimer(2);
    this.assertInstanceOf(tiptoi.Timer, timer);
    this.assertEquals(2, timer.getSeconds());
    
    timer.hasRunOut(function () {
      ok("has run out");
      start();
    });
  });
  
  asyncTest("cpu starts a timer and can stop it", function () {
    $.extend(this, setup());
    
    var timer = this.cpu.startTimer(2);
    
    timer.hasRunOut(function () {
      fail("no, because timer has stopped");
      start();
    });
    
    timer.stop();
    
    setTimeout(function () {
      ok("not failed before");
      start();
    }, 2*1000+20);
  });
  

  asyncTest("when cpu waits for timeout with timer and input is given in time everything works normally", function () {
    $.extend(this, setup([7], 800));
    
    var timer = this.cpu.startTimer(2);
    
    timer.hasRunOut(function () {
      fail("no, because inputLogic should have stopped it at 800 ms");
      start();
    });
    
    this.cpu.waitForInputWithTimer(timer, function (input) {
      console.log('stop timer');
      timer.stop();
      ok("input given right in time");
      this.assertEquals(7, input);
      start();
    });
  });

  asyncTest("when cpu waits for timeout with timer and input is given NOT in time, tiptoi-input-ignored is triggered", function () {
    $.extend(this, setup([7], 1200)); // use 1200 ms so that the input comes delayed after the timer has timed out
    
    var timer = this.cpu.startTimer(1); // 1000 ms timer
    
    this.cpu.on('tiptoi-input-ignored', function (e, reason, type, input) {
      ok("timer has timed out and input is ignored");
      this.assertEquals('timedout', reason);
      this.assertEquals(7, input);
      start();
    });
    
    this.cpu.waitForInputWithTimer(timer, function (input) {
      fail("input logic should not be called, because the input should be given to late");
      start();
    });
  });
});