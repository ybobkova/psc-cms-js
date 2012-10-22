define(['psc-tests-assert','Psc/UI/Comments','Psc/Test/DoublesManager'], function() {
  
  module("Psc.UI.Comments");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var comments = new Psc.UI.Comments({ });
    
    return {comments: comments};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.comments.doSomething();
  });
});