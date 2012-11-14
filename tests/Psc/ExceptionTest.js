define(['psc-tests-assert','Psc/Exception','Psc/InvalidArgumentException','Psc/AjaxException'], function (t) {
  
  module("Psc.Exception");
  
  test("copy an object with extend", function () {
    t.setup(this);
    var body = {autocomplete: 'true'};
    
    var mb = $.extend({}, body, {search: 'blubb'});
    
    this.assertEquals(
      mb, {
      autocomplete: 'true',
      search: 'blubb'
    });
  });
  
  test("construct", function() {
    t.setup(this);
    var e = new Psc.Exception('This will be shown');
    
    this.assertEquals('Psc.Exception',e.getName());
    this.assertEquals('This will be shown',e.getMessage());
    
    ok(e instanceof Psc.Exception);
  });
  
  // diese selftest ist für die assertions von unseren tests selbst und hat mit der library-logik eigentlich nichts zu tun
  // ich brauchte das hier zu demo zwekcen
  
  test("ajaxExceptionConstruct", function () {
    t.setup(this);
    var e = new Psc.AjaxException('error', 'interner fehler beim ajaxrequest');
    
    this.assertEquals('error', e.getTextStatus());
  });
  
  test("selftest", function() {
    t.setup(this);
    var e = new Psc.InvalidArgumentException('one',false);
    
    this.assertInstanceOf(Psc.Exception, e);
    this.assertInstanceOf(Psc.InvalidArgumentException, e);
    //
    //var o = {};
    //this.assertSame(o,o);
    //this.assertSame(o,{});
    //this.assertSame(o,o,"my objects are equal");
    //this.assertSame(o,{},"my objects are equal");
    //
    //this.assertEquals("yes","no");
    //this.assertEquals("yes","yes");
    //this.assertEquals("yes","no", 'getter value ist richtig');
    //this.assertEquals("yes","yes", 'getter value ist richtig');
    //
    //this.assertTrue(true, "bla bla gibt true zurück");
    //this.assertTrue(false, "bla bla gibt true zurück");
    //
    //fail('test ist blöd');
  });
  
  test("selftestAssertException", function() {
    t.setup(this);
    expect(0);
    var thrown = function () {
      throw new (Joose.Class({
        isa: Psc.Exception
      }))('Our nice Message');
    };
    
    var notThrown = function () {
      var t = 1+3;
    };
    
    // stürzt ab im IE
    //this.assertException(null, thrown, 'Our nice Message');
  });
});