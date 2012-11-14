define(['psc-tests-assert','tiptoi/InputProvider'], function(t) {
  
  module("tiptoi.InputProvider");

  asyncTest("acceptance for getInput", function() {
    var that = t.setup(this);
    
    expect(2);
    var inputProvider = new tiptoi.InputProvider({
      sequence: [77]
    });
    
    $.when( inputProvider.getInput() ).then(function (input) {
      that.assertEquals(77, input);
      start();
    });
    
    // second time gets rejected
    stop();
    $.when( inputProvider.getInput() ).then(function () {
      that.fail("getInput() darf nicht succeden weil sequence leer ist");
      start();
    }, function () {
      ok("get Input hat keinen input mehr");
      start();
    });
  });
});