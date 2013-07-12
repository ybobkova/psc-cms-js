define(['psc-tests-assert','tiptoi/cpu','tiptoi/InputProvider','tiptoi/Timer'], function(t) {
  
  module("tiptoi.cpu");
  
  var setup = function (test, sequence, delay) {
    if (!sequence) sequence = [];
    if (!delay) delay = 300;
    
    var cpu = new tiptoi.cpu({
      inputProvider: new tiptoi.InputProvider({
        sequence: sequence,
        delay: delay
      })
    });
    
    return t.setup(test, {cpu: cpu});
  };

  asyncTest("cpu starts a timer", function () {
    var that = setup(this);
    
    var timer = this.cpu.startTimer(2);
    this.assertInstanceOf(tiptoi.Timer, timer);
    this.assertEquals(2, timer.getSeconds());
    
    timer.hasRunOut(function () {
      ok("has run out");
      start();
    });
  });
  
  asyncTest("cpu starts a timer and can stop it", function () {
    var that = setup(this);
    
    var timer = this.cpu.startTimer(2);
    
    timer.hasRunOut(function () {
      that.fail("no, because timer has stopped");
      start();
    });
    
    timer.stop();
    
    setTimeout(function () {
      ok("not failed before");
      start();
    }, 2*1000+20);
  });
  

  asyncTest("when cpu waits for timeout with timer and input is given in time everything works normally", function () {
    var that = setup(this, [7], 800);
    
    var timer = this.cpu.startTimer(2);
    
    timer.hasRunOut(function () {
      that.fail("no, because inputLogic should have stopped it at 800 ms");
      start();
    });
    
    this.cpu.waitForInputWithTimer(timer, function (input) {
      timer.stop();
      ok("input given right in time");
      that.assertEquals(7, input);
      start();
    });
  });

  asyncTest("when cpu waits for timeout with timer and input is given NOT in time, tiptoi-input-ignored is triggered", function () {
    var that = setup(this, [7], 1200); // use 1200 ms so that the input comes delayed after the timer has timed out
    
    var timer = this.cpu.startTimer(1); // 1000 ms timer
    
    this.cpu.on('tiptoi-input-ignored', function (e, reason, type, input) {
      ok("timer has timed out and input is ignored");
      that.assertEquals('timedout', reason);
      that.assertEquals(7, input);
      start();
    });
    
    this.cpu.waitForInputWithTimer(timer, function (input) {
      that.fail("input logic should not be called, because the input should be given to late");
      start();
    });
  });

  test("cpu call call command test", function () {
    var that = setup(this);

    var playSounds = function (play) {};
    var tiptoi = { startTimer: function () {} };

    var programCode = function(options, func_tiptoi, func_playSounds) {
      that.assertSame(func_tiptoi, tiptoi);
      that.assertSame(func_playSounds, playSounds);
      that.assertTrue(options.opt1);
    };

    var scopes = [tiptoi, playSounds];

    var runProgram = function (options) {
      return programCode.apply(programCode, [options].concat(scopes));
    };

    runProgram({opt1: true});
  });

  test("cpu parses args names from function", function () {
    var that = setup(this);

    var args = this.cpu._parseFunctionArgs(function (options, playSounds, playSound, tiptoi, A) {

    });

    this.assertEquals(['options', 'playSounds', 'playSound', 'tiptoi', 'A'], args);
  });
});