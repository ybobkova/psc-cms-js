define(['psc-tests-assert','CoMun/Relation','Psc/Test/DoublesManager'], function() {
  
  module("CoMun.Relation");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var relation = new CoMun.Relation({ });
    
    return {relation: relation};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.relation.doSomething();
  });
});