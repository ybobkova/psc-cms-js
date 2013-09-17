define(['psc-tests-assert','tiptoi/GameMaker'], function(t) {
  
  module("tiptoi.GameMaker", {
    setup: function () {
      
    }
  });

  test("acceptance", function() {
     t.setup(this);
    
    var gameMaker = new tiptoi.GameMaker({
      name: 'aha',
      program: {
        code: 'none'
      },
      widget: $('<div />'),
      scale: {h: 1, v:1}
    });

    this.assertTrue(true, "the test is passed");  
  });
});