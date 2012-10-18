use(['Psc.Exception','Psc.InvalidArgumentException','Psc.AjaxException'], function () {
  module("Psc.Exception");
  
  //test("bootstrap: global object identifier", function () {
  //  var id = psc_globals_objectid;
  //  var o = {some: 'object'};
  //  
  //  Psc_applyGOID(o);
  //  
  //  assertEquals(id+1, o.goid);
  //  
  //  Psc_applyGOID(o);
  //  assertEquals(id+2, o.goid);
  //});

  test("copy an object with extend", function () {
    expect(0);
    var body = {autocomplete: 'true'};
    
    var mb = $.extend({}, body, {search: 'blubb'});
    
    console.log(mb);
  });
  
  test("construct", function() {
    var e = new Psc.Exception('This will be shown');
    
    assertEquals('Psc.Exception',e.getName());
    assertEquals('This will be shown',e.getMessage());
    
    ok(e instanceof Psc.Exception);
  });
  
  // diese selftest ist für die assertions von unseren tests selbst und hat mit der library-logik eigentlich nichts zu tun
  // ich brauchte das hier zu demo zwekcen
  
  test("ajaxExceptionConstruct", function () {
    var e = new Psc.AjaxException('error', 'interner fehler beim ajaxrequest');
    
    assertEquals('error', e.getTextStatus());
  });
  
  test("selftest", function() {
    var e = new Psc.InvalidArgumentException('one',false);
    
    assertInstanceOf(Psc.Exception, e);
    assertInstanceOf(Psc.InvalidArgumentException, e);
    //
    //var o = {};
    //assertSame(o,o);
    //assertSame(o,{});
    //assertSame(o,o,"my objects are equal");
    //assertSame(o,{},"my objects are equal");
    //
    //assertEquals("yes","no");
    //assertEquals("yes","yes");
    //assertEquals("yes","no", 'getter value ist richtig');
    //assertEquals("yes","yes", 'getter value ist richtig');
    //
    //assertTrue(true, "bla bla gibt true zurück");
    //assertTrue(false, "bla bla gibt true zurück");
    //
    //fail('test ist blöd');
  });
  
  test("selftestAssertException", function() {
    expect(0);
    var thrown = function () {
      throw new (Class({
        isa: 'Psc.Exception'
      }))('Our nice Message');
    };
    
    var notThrown = function () {
      var t = 1+3;
    }
    
    // stürzt ab im IE
    //assertException(null, thrown, 'Our nice Message');
  });
});