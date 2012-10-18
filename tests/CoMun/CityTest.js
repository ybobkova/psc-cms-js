use(['CoMun.City','Psc.Test.DoublesManager'], function() {
  
  module("CoMun.City");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var city = new CoMun.City({ });
    
    return {city: city};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.city.doSomething();
  });
});