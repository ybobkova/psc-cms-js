define(['psc-tests-assert','Psc/UI/jqx/WidgetWrapper','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.jqx.WidgetWrapper");
  
  var setup = function(test) {
    //var dm = new Psc.Test.DoublesManager();
    var widgetWrapper = new Psc.UI.jqx.WidgetWrapper({ });
    
    return t.setup(test, {widgetWrapper: widgetWrapper});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.widgetWrapper.doSomething();
  });
});