/*globals TestRole*/
define(['psc-tests-assert','stacktrace','joose', 'Psc/Code','Psc/WrongValueException','Psc/InvalidArgumentException','Psc/Request'], function (t, printStackTrace, Joose) {
  
  module("Psc.Code");
  
  test("splice", function () {
    t.setup(this);
    var o = {A: "some string", B: "another String"};
    
    var a = (Array.prototype.slice).call(o);
    
    this.assertEquals([], a);
  });

  
  test("valueReturnsFirstAndValidates", function() {
    t.setup(this);
    this.assertEquals('a1', Psc.Code.value('a1', 'a1','a2','a3'));
    this.assertEquals('a3', Psc.Code.value('a3', 'a1','a2','a3'));
    this.assertEquals('a2', Psc.Code.value('a2', 'a1','a2','a3'));
  });
  
  test("valueThrowsExceptionOnWrongEntry", function () {
    t.setup(this);
    this.assertException("Psc.WrongValueException", function () {
      Psc.Code.value('wrong', 'a1','a2','a3');
    });
    
  });
  
  test("stacktrace thingy", function () {
    /*globals a:true*/
    t.setup(this);
    
    var thiswillfail = function () {
      a++;
    };
    
    try {
      thiswillfail();
    } catch (e) {
      var stack = printStackTrace({e: e});
      
      this.assertTrue(stack.length > 2);
    }
    
  });
  
  test("varInfo", function() {
    t.setup(this);
    this.assertEquals('a1', Psc.Code.varInfo('a1'));
  });
  
  test("isArray", function() {
    var that = t.setup(this);
    var positiveValues = [
      ['eins'],
      [{v: 1}, {v: 2}],
      []
    ];
    
    var negativeValues = [
      'eins',
      7,
      { most: 'important' },
      {},
      new Psc.InvalidArgumentException('katching','blubb')
    ];
    
    Joose.A.each(positiveValues, function (data) {
      that.assertTrue(Psc.Code.isArray(data), that.debug(data)+" isArray");
    });

    Joose.A.each(negativeValues, function (data) {
      that.assertFalse(Psc.Code.isArray(data), that.debug(data)+" !isArray");
    });
  });


  test("isInstanceOf", function() {
    var that = t.setup(this);
    var iae = new Psc.InvalidArgumentException('katching','blubb');
    var e = new Psc.Exception('wuah');
    var o = {};
    var a = [];
    
    var positiveValues = [
      [iae, Psc.InvalidArgumentException],
      [e, Psc.Exception]
    ];
    
    var negativeValues = [
      ['eins', Psc.InvalidArgumentException],
      [e, Psc.InvalidArgumentException],
      [7, Psc.Exception],
      [7, Psc.Request], // muss vorher geladen worden sein
      [{ most: 'important' }, Psc.InvalidArgumentException],
      [a, Psc.InvalidArgumentException],
      [o, Psc.InvalidArgumentException]
    ];
    
    var failureValues = [
      [{}, 'Psc.Exception'], // string ist nicht erlaubt
      [{}, 7]
    ];
    
    Joose.A.each(positiveValues, function (data) {
      that.assertTrue(Psc.Code.isInstanceOf(data[0], data[1]), that.debug(data[0])+" isInstanceof "+that.debug(data[1]));
    });

    Joose.A.each(negativeValues, function (data) {
      that.assertFalse(Psc.Code.isInstanceOf(data[0], data[1]), that.debug(data[0])+" isInstanceof "+that.debug(data[1]));
    });

    Joose.A.each(failureValues, function (data) {
      QUnit.raises(function () {
        Psc.Code.isInstanceOf(data[0], data[1]);
      });
    });
  });
  
  test("isRole", function () {
    t.setup(this);
    Joose.Role("TestRole", {});
    
    var ObjectClass = Joose.Class({
      does: TestRole
    });
    
    var object = new ObjectClass();
    
    this.assertTrue(Psc.Code.isRole(object, TestRole));
    
    this.assertFalse(Psc.Code.isRole({}, TestRole));
    this.assertFalse(Psc.Code.isRole(new Psc.Exception('nope'), TestRole));
  });
});