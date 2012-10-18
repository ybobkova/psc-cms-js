use(['tiptoi.InteractiveInputProvider','Psc.Code'], function() {
  
  module("tiptoi.InteractiveIputProvider", {});

  asyncTest("acceptance", function () {
    expect(3);
    var $container = $('<div></div>');
    
    var provider = new tiptoi.InteractiveInputProvider({
      widget: $container
    });
    var evm = provider.getEventManager();
    
    var inputs = [];
    var sequence = [{oid: 17}, {oid: 18}];
    var listeningTipper = function () {
      var input = sequence.pop();
      Psc.Code.info('provider is listening. giving input:', input);
      $container.trigger('tiptoi-tip', [input]); // wir senden beides mal 17, was ja total langweilig ist, aber okay
    };

    evm.on('input-provider-listening', listeningTipper);
    
    // 1. mal
    var status1 = provider.getInput();
    $.when( status1 ).then(function (input) {
      inputs.push(input);
      Psc.Code.info('got input 1');
      
      assertEquals([18], inputs);
    
      
      // 2. mal
      var status2 = provider.getInput();
      assertNotSame(status1, status2);
      stop();
      $.when( status2 ).then(function (input) {
        inputs.push(input);
        Psc.Code.info('got input 2');
      
        assertEquals([18,17], inputs);
        start();
      });
    
      start();
    });
  });

  test("triggers input-provider-got-input on triggered tiptoi-tip event", function() {
    fail("todo");
  });
});