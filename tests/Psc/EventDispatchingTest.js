define(['psc-tests-assert','Psc/EventDispatching','Psc/EventManager'], function(t) {
  
  module("Psc.EventDispatching");
  
  var eventDispatchingClass = Class({
      does: Psc.EventDispatching
  });

  test("manager gets contructed and returned", function() {
    t.setup(this);
    
    var eventDispatcher = new eventDispatchingClass();
    this.assertInstanceOf(Psc.EventManager,eventDispatcher.getEventManager());
  });
    
  test("injection", function () {
    t.setup(this);
    
    var myEventManager = new Psc.EventManager();
    var eventDispatcher = new eventDispatchingClass( { eventManager: myEventManager} );

    this.assertSame(myEventManager, eventDispatcher.getEventManager(), 'eventManager gets injected through constructor');
  });
});