define(["jquery", "psc-cms", "qunit", "joose", "jqwidgets-global", "jqwidgets"], function ($) {
    // Send messages to the parent PhantomJS process via alert! Good times!!
    function sendMessage() {
      var args = [].slice.call(arguments);
      alert(JSON.stringify(args));
    }

    // do the same as the phantom bridge would do, but do it here, after we required qunit
    if (window._phantom) {
    
      // These methods connect QUnit to PhantomJS.
      QUnit.log(function(obj) {
        // What is this I don’t even
        if (obj.message === '[object Object], undefined:undefined') { return; }
        // Parse some stuff before sending it.
        var actual = QUnit.jsDump.parse(obj.actual);
        var expected = QUnit.jsDump.parse(obj.expected);
        // Send it.
        sendMessage('qunit.log', obj.result, actual, expected, obj.message, obj.source);
      });
      
      QUnit.testStart(function(obj) {
        sendMessage('qunit.testStart', obj.name);
      });
      
      QUnit.testDone(function(obj) {
        sendMessage('qunit.testDone', obj.name, obj.failed, obj.passed, obj.total);
      });
      
      QUnit.moduleStart(function(obj) {
        sendMessage('qunit.moduleStart', obj.name);
      });
      
      QUnit.moduleDone(function(obj) {
        sendMessage('qunit.moduleDone', obj.name, obj.failed, obj.passed, obj.total);
      });
      
      QUnit.begin(function() {
        sendMessage('qunit.begin');
      });
      
      QUnit.done(function(obj) {
        sendMessage('qunit.done', obj.failed, obj.passed, obj.total, obj.runtime);
      });
    }
    
    QUnit.config.reorder = false;
    QUnit.config.autostart = false;
    QUnit.config.autorun = false;
    QUnit.load(); 
    // we load qunit later because it cannot attach to window on load when its loaded asynchronously

    return {
      run: function (test) {
        if (test instanceof Array) {
          require(test, function () {
            QUnit.start();
          });
        } else {
          require(["../tests/"+test], function () {
            QUnit.start(); 
          });
        }
      }
    };
});
