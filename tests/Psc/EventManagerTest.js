define(['psc-tests-assert','Psc/EventManager'], function(t) {

  module("Psc.EventManager");
  
  var setup = function (test) {
    return t.setup(test, {
      eventManager: new Psc.EventManager()
    });
  };
  
  test("new Instance does not get triggered", function() {
    var that = setup(this);
    
    var manager1 = new Psc.EventManager();
    var manager2 = new Psc.EventManager();
    var called = false;
    
    manager1.on('testEvent', function(e) {
      that.fail('manager1 on must not be called');
    });

    manager2.on('testEvent', function(e) {
      called = true;
    });
    
    manager2.triggerEvent('testEvent');
    this.assertTrue(called, 'manager2 Event is called');
  });

  test("nativeBinding", function () {
    var that = setup(this);
    
    this.eventManager.on('tsing', function (e) {
      that.assertEquals('tsing', e.type, 'got event');
    });
    
    var ev = jQuery.Event('tsing', {schnurps: 'blubb'});
    
    this.eventManager.trigger(ev);
  });
  
  test("constructsJQueryEvents", function() {
    var that = setup(this);
    var savedEvent = that.eventManager.createEvent('saved', { method: 'edit' }); // nicht type benutzen als property das braucht jQuery
    
    // erstmal hinten wir nur das hier
    this.assertEquals('edit', savedEvent.method);
    this.assertEquals('saved', savedEvent.type);
  });
  
  test("firstArgumentFromTriggerEventHasToBeAString", function() {
    var that = setup(this);
    QUnit.raises(
      function () {
        // first param should be a string not the object -.-
        that.eventManager.triggerEvent({idiot:true}, ['var1']);
      }
    );
  });
  
  test("canBeTriggeredWithEvents_acceptsOnAndTrigger", function() {
    var that = setup(this), eventManager = that.eventManager;
    var eventCount = 0;
    
    eventManager.on('saved', function (e, add1, add2) { // meint Psc.saved
      that.assertEquals('add1', add1, 'additional Parameter wird im Handler übergeben');
      that.assertEquals('add2', add2);
      that.assertEquals('saved', e.type);
      that.assertEquals('edit', e.method);
      
      eventCount++;
    });
    
    eventManager.trigger(
      eventManager.createEvent('saved', { method: 'edit'}),
      ['add1','add2']
    );
    
    // or aequivalent
    eventManager.triggerEvent('saved', { method: 'edit'}, ['add1','add2']);
    
    this.assertEquals(2, eventCount, '2 Events were triggered');
  });
  
  test("stopsWithPreventedBefore", function() {
    var that = setup(this);
    var eventCount = 0;
    var eventManager = that.eventManager;
    // wer zuerst kommt und e.stopImmediatePropagation drückt gewinnt
    
    eventManager.on('test', function (e) {
      eventCount++;
      e.stopImmediatePropagation();
    });

    eventManager.on('test', function (e) {
      eventCount++; // does never happen
      that.fail('second test handler is called');
    });
    
    eventManager.triggerEvent('test');
    this.assertEquals(1,eventCount,'only one event is called');
  });

  test("whatever", function() {
    var that = setup(this);
    var eventCount = 0;
    var eventManager = new Psc.EventManager();
    // wer zuerst kommt und e.stopImmediatePropagation drückt gewinnt
    
    eventManager.on('test test2 test3', function (e) {
      e.stopImmediatePropagation();
    });

    eventManager.on('test', function (e) {
      eventCount++; // does never happen
      that.fail('first test handler is called');
    });

    eventManager.on('test2', function (e) {
      eventCount++; // does never happen
      that.fail('second test handler is called');
    });

    eventManager.on('test3', function (e) {
      eventCount++; // does never happen
      that.fail('third test handler is called');
    });
    
    eventManager.triggerEvent('test');
    eventManager.triggerEvent('test2');
    eventManager.triggerEvent('test3');
    this.assertEquals(0,eventCount, 'no event is called');
  });
  
  test("bindstwicetosamehandler", function() {
    var that = setup(this);
    var eventManager = that.eventManager;
    
    expect(2);
    
    eventManager.on('test', function (e) {
      that.assertTrue(true, 'ok, test ist called');
    });

    eventManager.on('test', function (e) {
      that.assertTrue(true, 'ok, second test ist called');
    });
    
    eventManager.triggerEvent('test');
  });
});