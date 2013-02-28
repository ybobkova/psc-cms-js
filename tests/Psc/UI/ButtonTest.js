define(['psc-tests-assert','Psc/UI/Button','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.Button");
  
  var setup = function(test) {
    //var dm = new Psc.Test.DoublesManager();
    var button = new Psc.UI.Button({
      label: 'mynicebutton',
      leftIcon: 'circle-plus'
    });

    var classesButton = new Psc.UI.Button({
      label: 'mynicebutton',
      leftIcon: 'circle-plus',
      classes: ['add-it']
    });
    
    return t.setup(test, {button: button, classesButton: classesButton});
  };

  test("acceptance", function() {
    setup(this);
  
    var $button = this.button.create();
    $('#visible-fixture').append($button);
    
    this.assertTrue($button.hasClass('psc-cms-ui-button'));
    this.assertTrue($button.hasClass('ui-button'));
    
    this.assertEquals({primary: 'ui-icon-circle-plus',secondary:null}, $button.button('option','icons'));
  });
  
  test("click can be given as property", function () {
    setup(this);
    
    var wasClicked = false;
    
    var button = new Psc.UI.Button({
      'label': 'clickable',
      click: function() {
        wasClicked = true;
      }
    });
    
    var $button = button.create();
    
    $button.trigger('click');
    
    this.assertTrue(wasClicked, 'button was clicked through trigger');
  });
  
  test("classes as attribute adds to created html some classes", function() {
    setup(this);
    
    var $button = this.classesButton.create();
    
    this.assertjQueryHasClass('add-it', $button);
    
  });
});