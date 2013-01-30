define(['psc-tests-assert', 'joose', 'Psc/EventDispatching','Psc/EventManager'], function(t, Joose) {
  
  module("Psc.EventDispatching");
  
  var EventDispatchingClass = Joose.Class({
      does: Psc.EventDispatching
  });

  test("manager gets contructed and returned", function() {
    t.setup(this);
    
    var eventDispatcher = new EventDispatchingClass();
    this.assertInstanceOf(Psc.EventManager,eventDispatcher.getEventManager());
  });
    
  test("injection", function () {
    t.setup(this);
    
    var myEventManager = new Psc.EventManager();
    var eventDispatcher = new EventDispatchingClass( { eventManager: myEventManager} );

    this.assertSame(myEventManager, eventDispatcher.getEventManager(), 'eventManager gets injected through constructor');
  });
});