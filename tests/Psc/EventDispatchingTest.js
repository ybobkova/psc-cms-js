use(['Psc.EventDispatching','Psc.EventManager'], function() {
  
  module("Psc.EventDispatching", {
    setup: function () {
      
    }
  });
  
  var eventDispatchingClass = Class({
      does: Psc.EventDispatching
  });

  test("manager gets contructed and returned", function() {
    var eventDispatcher = new eventDispatchingClass();
    assertInstanceOf(Psc.EventManager,eventDispatcher.getEventManager());
  });
    
  test("injection", function () {
    var myEventManager = new Psc.EventManager();
    var eventDispatcher = new eventDispatchingClass( { eventManager: myEventManager} );

    assertSame(myEventManager, eventDispatcher.getEventManager(), 'eventManager gets injected through constructor');
  });
});