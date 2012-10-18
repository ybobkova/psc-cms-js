use(['Psc.UI.HTML.TagBuilder','Psc.Test.DoublesManager'], function() {
  
  module("Psc.UI.HTML.TagBuilder");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var tagBuilder = new Psc.UI.HTML.TagBuilder({ });
    
    $.extend(test, {tagBuilder: tagBuilder});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.tagBuilder.doSomething();
  });
});