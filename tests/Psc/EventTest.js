define(['psc-tests-assert','Psc/Exception'], function () {
  module("Psc.Event"); // to fake it
  
  test("eventON", function() {
    expect(0);
    var $form = $('<div class="form"><div><input type="text" name="in1" class="sp1" /><input type="text" name="in2" class="sp1" /><input type="text" readonly="readonly" name="in3" class="sp1" /></div><select name="s1" class="sp1"><option></option></select><select name="s2" readonly="readonly" class="sp1"><option></option></select></div>');
    var fixture = $('#qunit-fixture');
    
    fixture.append($form);
    
    fixture.on('evtype evtype2', '(input, select).sp1:not([readonly="readonly"])', function (e) {
    });
    
    //fixture.trigger('evtype');
    $form.find('input[name=in1]').trigger('evtype');
    $form.find('input[name=in2]').trigger('evtype');
    $form.find('input[name=in3]').trigger('evtype');
    $form.find('select').trigger('evtype');
  });
  
  // diese selftest ist für die assertions von unseren tests selbst und hat mit der library-logik eigentlich nichts zu tun
  // ich brauchte das hier zu demo zwekcen
  
  //test("selftest", function() {
  //  var e = new Psc.InvalidArgumentException('one',false);
  //  
  //  this.assertInstanceOf(Psc.Exception, e);
  //  this.assertInstanceOf(Psc.AjaxHandler, e);
  //
  //  var o = {};
  //  this.assertSame(o,o);
  //  this.assertSame(o,{});
  //  this.assertSame(o,o,"my objects are equal");
  //  this.assertSame(o,{},"my objects are equal");
  //  
  //  this.assertEquals("yes","no");
  //  this.assertEquals("yes","yes");
  //  this.assertEquals("yes","no", 'getter value ist richtig');
  //  this.assertEquals("yes","yes", 'getter value ist richtig');
  //  
  //  this.assertTrue(true, "bla bla gibt true zurück");
  //  this.assertTrue(false, "bla bla gibt true zurück");
  //
  //  fail('test ist blöd');
  //});
});