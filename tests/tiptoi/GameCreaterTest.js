define(['psc-tests-assert','tiptoi/GameCreater'], function(t) {
  
  module("tiptoi.GameCreater");
  
  var setup = function () {
    var gameCreater = new tiptoi.GameCreater({ });
    
    return {gameCreater: gameCreater};
  };

  test("acceptance", function() {
    setup(this);
  
    // this.gameCreater.doSomething();
  });
});