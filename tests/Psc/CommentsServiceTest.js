use(['Psc.CommentsService','Psc.Test.DoublesManager'], function() {
  
  module("Psc.CommentsService");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var commentsService = new Psc.CommentsService({ });
    
    return {commentsService: commentsService};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.commentsService.doSomething();
  });
});