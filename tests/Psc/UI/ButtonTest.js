define(['psc-tests-assert','Psc/UI/Button','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.Button");
  
  var setup = function(test) {
    //var dm = new Psc.Test.DoublesManager();
    var button = new Psc.UI.Button({
      label: 'mynicebutton',
      leftIcon: 'circle-plus'
    });
    
    return t.setup(test, {button: button});
  };

  test("acceptance", function() {
    setup(this);
  
    var $button = this.button.create();
    $('#visible-fixture').append($button);
    
    this.assertTrue($button.hasClass('psc-cms-ui-button'));
    this.assertTrue($button.hasClass('ui-button'));
    
    this.assertEquals({primary: 'ui-icon-circle-plus',secondary:null}, $button.button('option','icons'));
  });
});