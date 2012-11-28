define(['psc-tests-assert', 'Psc/UI/Controller', 'Psc/UI/Tab'], function(t) {
  
  module("Psc.UI.Controller");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var tabs = {
      open: function (tab) {
        test.openedTab = tab;
      }
    };
    
    var controller = new Psc.UI.Controller({
      tabs: tabs
    });
    
    return t.setup(test, {controller: controller, openedTab: undefined});
  };
  
  asyncTest("openTab creates a tab and opens it in tabs", function() {
    var that = setup(this);
    
    $.when(this.controller.openTab('sound', 7, {label: "Label for the tab for sound 7"})).then(function (tab) {
      that.assertSame(tab, that.openedTab);
      that.assertInstanceOf(Psc.UI.Tab, that.openedTab);
      that.assertEquals('entities/sound/7/form', that.openedTab.getUrl());
        
      start();
    });
  });
});