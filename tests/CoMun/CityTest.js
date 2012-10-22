define(['psc-tests-assert','CoMun/City','Psc/Test/DoublesManager'], function(t) {
  
  module("CoMun.City");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var city = new CoMun.City({
      id: 17,
      labelPosition: {top: '12px', left: '120px'},
      position: {top: '35px', left: '121px'},
      name: 'Hamburg',
      marked: false,
      type: 'german'
    });
    
    return t.setup(test, {city: city});
  };

  test("acceptance", function() {
    setup(this);
  
    this.assertEquals("german", this.city.getType());
  });
});