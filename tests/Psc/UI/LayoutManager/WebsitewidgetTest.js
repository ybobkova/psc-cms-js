define(['psc-tests-assert','Psc/UI/LayoutManager/Websitewidget','Psc/Test/DoublesManager'], function() {
  
  module("Psc.UI.LayoutManager.Websitewidget");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var websitewidget = new Psc.UI.LayoutManager.Websitewidget({ });
    
    return {websitewidget: websitewidget};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.websitewidget.doSomething();
  });
});