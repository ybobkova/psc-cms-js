define(['tiptoi/GameCreater'], function() {
  
  module("tiptoi.GameCreater");
  
  var setup = function () {
    var gameCreater = new tiptoi.GameCreater({ });
    
    return {gameCreater: gameCreater};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    // this.gameCreater.doSomething();
  });
});