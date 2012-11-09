define(['psc-tests-assert','Psc/CMS/ComboDropBoxable','Psc/UI/DropBoxButton','Psc/CMS/FastItem'], function(t) {
  
  module("Psc.CMS.ComboDropBoxable");
  
  var setup = function (test) {
    var comboDropBoxable = new Psc.CMS.FastItem({
      tab: {
        id: 'entities-person-17-form',
        url: '/entities/person/17/form',
        label: 'Person Nummer 17'
      },
      ac: {
        label: '[#17] Person mit vollen Namen. (Groß, blondhaarig)'
      },
      button: {
        label: 'Button Person #17',
        fullLabel: 'Der volle Name der Person Nummer 17, die auch sonstige Informationen hat, die einfach zu lang zum anzeigen sind',
        leftIcon: 'plus',
        rightIcon: null
      },
      identifier: 17,
      entityName: 'article',
      widget: $('<button></button>')
    });
    
    return t.setup(test, {comboDropBoxable: comboDropBoxable});
  };

  test("acceptance", function() {
    setup(this);
    this.assertInstanceOf(Psc.UI.Tab, tab = this.comboDropBoxable.getTab());
    this.assertDoesRole(Psc.UI.DropBoxButton, this.comboDropBoxable.getDropBoxButton());
    
  });
  
  test("buttonable sets button icons", function () {
    setup(this);
    var $button = this.comboDropBoxable.createButton();
    
    //this.assertInstanceOf(Psc.UI.Button, button = comboDropBoxable.getButton());
    this.assertEquals({primary: 'ui-icon-plus', secondary: null}, $button.button('option','icons'), 'icons are correct');
  });
});