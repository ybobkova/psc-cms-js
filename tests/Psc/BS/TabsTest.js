define(['psc-tests-assert', 'jquery', 'text!test-files/BS/empty.tabs.html', 'Psc/BS/Tabs'], function(t, $, tabsHTML) {
  
  module("Psc.BS.Tabs");

  var setup = function (test) {
    var tabs;
    //var dm = new Psc.Test.DoublesManager();
    //var tabs = new Psc.BS.Tabs({
    //});
    
    $('#visible-fixture').empty().append(tabsHTML);
    
    return t.setup(test, {tabs: tabs});
  };
  
  test("", function() {
    var that = setup(this);
  });
});