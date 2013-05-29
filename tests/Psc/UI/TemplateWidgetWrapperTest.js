define(['psc-tests-assert', 'Psc/UI/TemplateWidgetWrapper'], function(t) {
  
  module("Psc.UI.TemplateWidgetWrapper");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var templateWidgetWrapper = new Psc.UI.TemplateWidgetWrapper({
    });
    
    return t.setup(test, {templateWidgetWrapper: templateWidgetWrapper});
  };
  
  test("", function() {
    var that = setup(this);
  });
});