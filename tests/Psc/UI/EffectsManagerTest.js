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

  test("successBlink does blink a button", function() {
    var that = setup(this);
    expect(0);
    var effectsManager = new Psc.UI.EffectsManager({ });
    
    var $button = $('<button>My Save Button</button>').button({});
    $('#visible-fixture').empty().append($button);
    
    setTimeout(function () {
      effectsManager.successBlink($button);
    }, 1200);
    
  });
});