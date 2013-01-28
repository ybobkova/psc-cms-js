define(['psc-tests-assert', 'Psc/UI/MiniButtonPanel'], function(t) {
  
  module("Psc.UI.MiniButtonPanel");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    test.addLinkClicked = false;
    
    var miniButtonPanel = new Psc.UI.MiniButtonPanel({
      'add-link': {
        label: 'Link hinzufügen',
        click: function () {
          test.addLinkClicked = true;
        }
      }
    });
    
    return t.setup(test, {panel: miniButtonPanel});
  };
  
  test("miniButtonPanelHTMLIsCreated", function() {
    var that = setup(this), html;
    
    this.$widget.html(html = this.panel.html());
    
    this.assertjQueryLength(1, html);
  });
});