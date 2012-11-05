define(['psc-tests-assert','tiptoi/GameCreater'], function(t) {
  
  module("tiptoi.GameCreater");
  
  var setup = function(test) {
    var gameCreater = new tiptoi.GameCreater({ });
    
    return t.setup(test, {gameCreater: gameCreater});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.gameCreater.doSomething();
  });
});