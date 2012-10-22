define(['CoMun/SearchWidget','Psc/Test/DoublesManager'], function() {
  
  module("CoMun.SearchWidget");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var searchWidget = new CoMun.SearchWidget({ });
    
    $.extend(test, {searchWidget: searchWidget});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.searchWidget.doSomething();
  });
});