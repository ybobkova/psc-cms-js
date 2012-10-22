define(['psc-tests-assert','Psc/UI/EffectsManager'], function() {
  
  module("Psc.UI.EffectsManager", {
    setup: function () {
      
    }
  });

  asyncTest("blinkCallbackGetsCalled", function() {
    var effectsManager = new Psc.UI.EffectsManager({ });
    
    var cb = function () {
      start();
      this.assertTrue(true, "Callback has been run");
    }
    
    effectsManager.blink($('#qunit-fixture'), '#880022', cb);
  });

  test("successBlink does blink a button", function() {
    expect(0);
    var effectsManager = new Psc.UI.EffectsManager({ });
    
    var $button = $('<button>My Save Button</button>').button({});
    $('#visible-fixture').empty().append($button);
    
    setTimeout(function () {
      effectsManager.successBlink($button);
    }, 1200);
    
  });
});