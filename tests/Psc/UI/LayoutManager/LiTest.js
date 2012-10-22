define(['Psc/UI/LayoutManager/List'], function() {
  
  module("Psc.UI.LayoutManager.List");
  
  var setup = function () {
    var list = new Psc.UI.LayoutManager.List({ });
    
    return {list: list};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.list.doSomething();
  });
});