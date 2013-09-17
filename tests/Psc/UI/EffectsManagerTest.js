define(['psc-tests-assert','Psc/UI/EffectsManager'], function(t) {
  
  module("Psc.UI.EffectsManager");

  var setup = function(test) {
    return t.setup(test);
  };
  
  asyncTest("blinkCallbackGetsCalled", function() {
    var that = setup(this);
    var effectsManager = new Psc.UI.EffectsManager({ });
    
    var cb = function () {
      start();
      that.assertTrue(true, "Callback has been run");
    };
    
    effectsManager.blink($('#qunit-fixture'), '#880022', cb);
  });

  asyncTest("successBlink does blink a button", function() {
    var that = setup(this);
    var effectsManager = new Psc.UI.EffectsManager({ });
    
    var $button = $('<button>My Save Button</button>').button({});
    $('#visible-fixture').empty().append($button);
    
    setTimeout(function () {
      effectsManager.successBlink($button);
      that.assertTrue(true, 'test not visible for tests');
      start();
    }, 1200);
  });
});