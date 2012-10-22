define(['psc-tests-assert','tiptoi/Sound'], function() {
  
  module("tiptoi.Sound", {
    setup: function () {
      
    }
  });

  test("acceptance", function() {
    var sound = new tiptoi.Sound({
      content: 'i make a trembling noise',
      number: '2-TEST_0001'
    });
  
    this.assertEquals("„i make a trembling noise“ (2-TEST_0001)", sound.toString());
  });
});