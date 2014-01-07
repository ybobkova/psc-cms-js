define(['psc-tests-assert','tiptoi/Sound'], function(t) {
  
  module("tiptoi.Sound");
  
  var setup = function (test) {
    return t.setup(test);
  };

  test("acceptance", function() {
    var that = setup(this);
    var sound = new tiptoi.Sound({
      content: 'i make a trembling noise',
      number: '2-TEST_0001'
    });
  
    this.assertEquals("„i make a trembling noise“ (2-TEST_0001)", sound.asString());
  });
});