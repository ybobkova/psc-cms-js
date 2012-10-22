define(['Psc/UI/WidgetWrapper'], function() {
  module("Psc.UI.WidgetWrapper");

  test("acceptance", function() {
    var $widget;
    var widgetWrapper = new Psc.UI.WidgetWrapper({ widget: $widget = $('#qunit-fixture') });
  
    assertSame($widget, widgetWrapper.unwrap(), 'unwrap returns $widget');
  });
  
  test("can unwrap statically", function() {
    fail("todo");
    //var widgetWrapper = new Psc.UI.WidgetWrapper({ widget: $widget = $('#qunit-fixture') });
    
  });
});