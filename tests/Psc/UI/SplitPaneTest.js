define(['psc-tests-assert','Psc/UI/SplitPane'], function(t) {
  
  module("Psc.UI.SplitPane");
  
  var setup = function(test) {
    var splitPane = new Psc.UI.SplitPane({ });
    
    return t.setup(test, {splitPane: splitPane});
  };

  test("acceptance", function() {
    var that = setup(this);
  
    var $html = this.splitPane.html();

    var $pane = this.assertjQueryIs('.psc-cms-ui-splitpane', $html);
    this.assertjQueryLength(1, $pane.find('.left'));
    this.assertjQueryLength(1, $pane.find('.right'));
  });
});