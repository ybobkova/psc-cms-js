define(['psc-tests-assert', 'Psc/UI/InteractionProvider', 'Psc/UI/InteractionCanceledException'], function(t) {
  
  module("Psc.UI.InteractionProvider");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var interactionProvider = new Psc.UI.InteractionProvider({
    });
    
    return t.setup(test, {interactionProvider: interactionProvider});
  };
  
  test("provider has methods prompt() and confirm()", function() {
    var that = setup(this);
    
    this.assertFunction(this.interactionProvider.prompt, 'method prompt is a function');
    this.assertFunction(this.interactionProvider.confirm, 'method confirm is a function');
    
  });
  
  //test("prompt() acceptance for cancel", function () {
  //  setup(this);
  //  
  //  try {
  //    this.interactionProvider.prompt("please cancel this");
  //    
  //  } catch (ex) {
  //    this.assertInstanceOf(Psc.UI.InteractionCanceledException, ex, 'exception of type Psc.UI.InteractionCanceledException was thrown');
  //    return;
  //  }
  //  
  //  this.fail('no expected exception is thrown');
  //});
});