define(['psc-tests-assert','CoMun/WebsiteMap','Psc/Test/DoublesManager'], function() {
  
  module("CoMun.WebsiteMap");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var websiteMap = new CoMun.WebsiteMap({ });
    
    return {websiteMap: websiteMap};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.websiteMap.doSomething();
  });
});