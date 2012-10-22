define(['Psc/UI/jqx/WidgetWrapper','Psc/Test/DoublesManager'], function() {
  
  module("Psc.UI.jqx.WidgetWrapper");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var widgetWrapper = new Psc.UI.jqx.WidgetWrapper({ });
    
    return {widgetWrapper: widgetWrapper};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.widgetWrapper.doSomething();
  });
});