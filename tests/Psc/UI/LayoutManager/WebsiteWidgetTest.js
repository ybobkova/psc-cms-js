define(['psc-tests-assert','Psc/UI/LayoutManager/WebsiteWidget','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.LayoutManager.WebsiteWidget");
  
  var setup = function(test) {
    //var dm = new Psc.Test.DoublesManager();
    var websiteWidget = new Psc.UI.LayoutManager.WebsiteWidget({
      'name': 'calendar',
      'label': 'Kalendar'
    });
    
    return t.setup(test, {websiteWidget: websiteWidget});
  };

  test("label can be injected", function() {
    setup(this);
  
    this.assertEquals("Kalendar", this.websiteWidget.getLabel());
  });
  
  test("label can be left out", function() {
    setup(this);
    
    var wsw = new Psc.UI.LayoutManager.WebsiteWidget({
      name: 'something'
    });
  
    this.assertEquals("unknown website-widget", wsw.getLabel());
  });  
});