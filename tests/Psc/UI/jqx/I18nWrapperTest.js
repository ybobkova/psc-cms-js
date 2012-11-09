define(['psc-tests-assert','text!fixtures/jqx.i18n.widget.html','Psc/Loader','Psc/UI/jqx/I18nWrapper','Psc/Test/DoublesManager'], function(t, html) {
  
  module("Psc.UI.jqx.I18nWrapper");
  
  var setup = function (test) {
    
    var $widget = $('#visible-fixture').empty().append(html).find('.webforge-jqx-tabs');

    var i18nWrapper = new Psc.UI.jqx.I18nWrapper({
      'languages': ["de", "fr"],
      'widget': $widget
    });

    return t.setup(test, {i18nWrapper: i18nWrapper, $widget: $widget});
  };

  test("uiWidgetInitializesAWidgetInATabWithEveryTabAsALanguage", function() {
    var that = setup(this);
    
    that.assertInstanceOf(Psc.UI.jqx.I18nWrapper, this.i18nWrapper);
    that.assertjQueryLength(2, that.$widget.find('.jqx-tabs-title-container li'));
  });
});