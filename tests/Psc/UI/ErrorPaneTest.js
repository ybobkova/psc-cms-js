define(['psc-tests-assert','Psc/UI/ErrorPane'], function() {
  
  module("Psc.UI.ErrorPane", {
    setup: function () {
      
    }
  });

  test("acceptance", function() {
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