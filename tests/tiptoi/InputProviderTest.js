define(['tiptoi/InputProvider'], function() {
  
  module("tiptoi.InputProvider", {
    setup: function () {
      
    }
  });

  asyncTest("acceptance for getInput", function() {
    expect(2);
    var inputProvider = new tiptoi.InputProvider({
      sequence: [77]
    });
    
    $.when( inputProvider.getInput() ).then(function (input) {
      assertEquals(77, input);
      start();
    });
    
    // second time gets rejected
    stop();
    $.when( inputProvider.getInput() ).then(function () {
      fail("getInput() darf nicht succeden weil sequence leer ist");
      start();
    }, function () {
      ok("get Input hat keinen input mehr");
      start();
    });
  });
});