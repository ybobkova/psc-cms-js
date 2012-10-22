define(['psc-tests-assert','Psc/UI/Main', 'Psc/Exception'], function () {
    var log = '';
    var setupCount = 1, teardownCount = 1;
    
    module("async2", {
      setup: function () {
        log += 'setup'+(setupCount++)+" ";
      }, teardown: function () {
        log += 'teardown'+(teardownCount++)+" ";
      }
    });
  
    asyncTest("test1", function () {
      log += 'test1 ';
      expect(0);
      
      setTimeout(function () {
        log += 'test1-continue ';
        start();
      }, 500);
    });
  

  
    asyncTest("test2", function () {
      log += 'test2 ';
      expect(0);
      
      setTimeout(function () {
        log += 'test2-continue ';
        start();
      }, 450);
    });

    asyncTest("test3", function () {
      expect(0);
      log += 'test3 ';
      
      setTimeout(function () {
         log += 'test3-continue ';
        start();
      }, 800);
    });

    QUnit.moduleDone(function (module) {
        if (module.name === "async2") {
          var expected =
            "setup1 test1 test1-continue teardown1 "+
            "setup2 test2 test2-continue teardown2 "+
            "setup3 test3 test3-continue teardown3 ";
      
          if (log !== expected) {
            throw new Error("Assertion failed:\n"+log+"\n"+expected);
          }
        }
      
    });
});