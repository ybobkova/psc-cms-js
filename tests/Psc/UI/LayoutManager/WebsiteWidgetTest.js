define(['psc-tests-assert','Psc/UI/LayoutManager/Websitewidget','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.LayoutManager.Websitewidget");
  
  var setup = function(test) {
    //var dm = new Psc.Test.DoublesManager();
    var websitewidget = new Psc.UI.LayoutManager.Websitewidget({
      'name': 'calendar',
      'label': 'Kalendar'
    });
    
    return t.setup(test, {websitewidget: websitewidget});
  };

  test("label can be injected", function() {
    setup(this);
  
    this.assertEquals("Kalendar", this.websitewidget.getLabel());
  });
  
  test("label can be left out", function() {
    setup(this);
    
    var wsw = new Psc.UI.LayoutManager.Websitewidget({
      name: 'something'
    });
  
    this.assertEquals("unknown website-widget", wsw.getLabel());
  });  
});