define(['psc-tests-assert','Psc/UI/WidgetWrapper'], function(t) {
  
  module("Psc.UI.WidgetWrapper");
  
  var setup = function(test) {
    return t.setup(test);
  };

  test("acceptance", function() {
    setup(this);
    var $widget;
    var widgetWrapper = new Psc.UI.WidgetWrapper({ widget: $widget = $('#qunit-fixture') });
  
    this.assertSame($widget, widgetWrapper.unwrap(), 'unwrap returns $widget');
  });
  
  test("TODO: can unwrap statically", function() {
    t.setup(this);
    this.assertTrue(true, 'test incomplete');
  });
});