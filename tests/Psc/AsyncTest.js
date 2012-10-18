    QUnit.config.autostart = false;
    use(['Psc.Exception','Psc.Code'], function () {
    
    QUnit.start();
    var setupCount = 1, teardownCount = 1;
      
      module("async", {
        setup: function () {
          console.log('setup'+setupCount++);
        }, teardown: function () {
          console.log('teardown'+teardownCount++);
        }
      });
    
      asyncTest("test1", function () {
        console.log('test1');
        expect(0);
        
        setTimeout(function () {
          console.log('test1 continue');
          start();
        }, 2000);
      });
    
      asyncTest("test2", function () {
        console.log('test2');
        expect(0);
        
        setTimeout(function () {
          console.log('test2 continue');
          start();
        }, 2000);
      });
    
      asyncTest("test3", function () {
        expect(0);
        console.log('test3');
        
        setTimeout(function () {
          console.log('test3 continue');
          start();
        }, 1000);
      });
    });