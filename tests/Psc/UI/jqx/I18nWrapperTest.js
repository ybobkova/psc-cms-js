define(['Psc/UI/jqx/I18nWrapper','Psc/Test/DoublesManager'], function() {
  
  module("Psc.UI.jqx.I18nWrapper");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var i18nWrapper = new Psc.UI.jqx.I18nWrapper({ });
    
    $.extend(test, {i18nWrapper: i18nWrapper});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.i18nWrapper.doSomething();
  });
});