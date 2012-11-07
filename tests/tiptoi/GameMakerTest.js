define(['psc-tests-assert','tiptoi/GameMaker'], function(t) {
  
  module("tiptoi.GameMaker", {
    setup: function () {
      
    }
  });

  test("acceptance", function() {
    expect(0);
    
    var gameMaker = new tiptoi.GameMaker({
      name: 'aha',
      program: {
        code: 'none'
      },
      widget: $('<div />'),
      scale: {h: 1, v:1}
    });
  
  });
});