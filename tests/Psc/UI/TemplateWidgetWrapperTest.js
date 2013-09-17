define(['psc-tests-assert', 'Psc/UI/TemplateWidgetWrapper', 'Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.TemplateWidgetWrapper");

  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();
    var templateWidgetWrapper = new Psc.UI.TemplateWidgetWrapper({
      templateName: 'tiptoi.SoundImporter',
      container: dm.getContainer(),
      widget: $('<div></div>')
    });
    
    return t.setup(test, {templateWidgetWrapper: templateWidgetWrapper});
  };
  
  test("acceptance", function() {
    var that = setup(this);

    this.assertNotUndefined(this.templateWidgetWrapper.render());

  });
});