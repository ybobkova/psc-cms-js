define(['psc-tests-assert','tiptoi/Timer'], function(t) {
  
  module("tiptoi.Timer");
  
  var setup = function () {
    var timer = new tiptoi.Timer({ });
    
    return {timer: timer};
  };

  test("acceptance", function() {
    setup(this);
  
    // this.timer.doSomething();
  });
});