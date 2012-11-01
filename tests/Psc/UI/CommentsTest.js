define(['psc-tests-assert','Psc/UI/Comments','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.Comments");
  
  var setup = function(test) {
    //var dm = new Psc.Test.DoublesManager();
    var comments = new Psc.UI.Comments({ });
    
    return t.setup(test, {comments: comments});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.comments.doSomething();
  });
});