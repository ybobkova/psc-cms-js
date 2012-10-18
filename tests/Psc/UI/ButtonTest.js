use(['Psc.UI.Button','Psc.Test.DoublesManager'], function() {
  
  module("Psc.UI.Button");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var button = new Psc.UI.Button({
      label: 'mynicebutton',
      leftIcon: 'circle-plus'
    });
    
    return {button: button};
  };

  test("acceptance", function() {
    $.extend(this, setup());
  
    var $button = this.button.create();
    $('#visible-fixture').append($button);
    
    assertTrue($button.hasClass('psc-cms-ui-button'));
    assertTrue($button.hasClass('ui-button'));
    
    assertEquals({primary: 'ui-icon-circle-plus',secondary:null}, $button.button('option','icons'));
  });
});