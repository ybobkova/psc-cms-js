define(['psc-tests-assert','Psc/EventDispatching','Psc/EventManager'], function() {
  
  module("Psc.EventDispatching", {
    setup: function () {
      
    }
  });
  
  var eventDispatchingClass = Class({
      does: Psc.EventDispatching
  });

  test("manager gets contructed and returned", function() {
    var eventDispatcher = new eventDispatchingClass();
    this.assertInstanceOf(Psc.EventManager,eventDispatcher.getEventManager());
  });
    
  test("injection", function () {
    var myEventManager = new Psc.EventManager();
    var eventDispatcher = new eventDispatchingClass( { eventManager: myEventManager} );

    this.assertSame(myEventManager, eventDispatcher.getEventManager(), 'eventManager gets injected through constructor');
  });
});