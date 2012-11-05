define(['psc-tests-assert','Psc/UI/ErrorPane'], function(t) {
  
  var setup = function(test) {
    return t.setup(test);
  };
  
  module("Psc.UI.ErrorPane");

  test("acceptance", function() {
    setup(this);
    var errorPane = new Psc.UI.ErrorPane({
      container: $('#qunit-fixture'),
      label: 'some',
      errorMessage: 'some text'+"\nwillbe converted"
    });
    
    errorPane.display();
    this.assertEquals(1, $('#qunit-fixture .psc-cms-ui-error-pane').length);
    
    // does not attach twice
    errorPane.display();
    this.assertEquals(1, $('#qunit-fixture .psc-cms-ui-error-pane').length);
  });
  
  test("can be removed", function () {
    setup(this);
    var errorPane = new Psc.UI.ErrorPane({
      container: $('#qunit-fixture'),
      label: 'some',
      errorMessage: 'some text'+"\nwillbe converted"
    });
    
    errorPane.display();
    this.assertEquals(1, $('#qunit-fixture .psc-cms-ui-error-pane').length);
    
    errorPane.hide();
    this.assertEquals(0, $('#qunit-fixture .psc-cms-ui-error-pane').length);
  });
});