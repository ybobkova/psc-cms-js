define(['psc-tests-assert', 'Psc/UI/MiniButtonPanel'], function(t) {
  
  module("Psc.UI.MiniButtonPanel");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    test.addLinkClicked = false;
    
    var miniButtonPanel = new Psc.UI.MiniButtonPanel({
      buttons: {
        'add-link': {
          label: 'Link hinzufügen',
          click: function () {
            test.addLinkClicked = true;
          }
        },
        'bold': {
          label: 'fett schreiben'
        },
        'italic': {
          label: 'kursiv schreiben'
        }
      }
    });
    
    return t.setup(test, {panel: miniButtonPanel});
  };
  
  test("miniButtonPanelHTMLIsCreated, hasName as class", function() {
    var that = setup(this), html;
    
    this.$widget.html(html = this.panel.html());
    
    var $panel = this.assertjQueryLength(1, html);
    var $button = this.assertjQueryLength(1, $panel.find('.psc-cms-ui-button.add-link'));
  });
  
  test("addLinkButton is clickable", function() {
    var that = setup(this), html;
    
    this.$widget.html(html = this.panel.html());
    
    var $button = this.assertjQueryLength(1, html.find('.psc-cms-ui-button.add-link'));
    
    $button.trigger('click');
    
    this.assertTrue(this.addLinkClicked, 'link was clicked');
  });
  
  test("MiniButtonPanel constructs a button set", function () {
    var that = setup(this), html;
    
    this.$widget.html(html = this.panel.html());
    
    this.assertjQueryHasWidget('buttonset', html);
  });
});