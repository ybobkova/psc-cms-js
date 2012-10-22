define(['psc-tests-assert','Psc/CMS/ComboDropBoxable','Psc/UI/DropBoxButton','Psc/CMS/FastItem'], function() {
  var comboDropBoxable;
  
  module("Psc.CMS.ComboDropBoxable", {
    setup: function () {
      comboDropBoxable = new Psc.CMS.FastItem({
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
   }
  });

  test("acceptance", function() {
    this.assertInstanceOf(Psc.UI.Tab, tab = comboDropBoxable.getTab());
    this.assertDoesRole(Psc.UI.DropBoxButton, comboDropBoxable.getDropBoxButton());
    
  });
  
  test("buttonable sets button icons", function () {
    var $button = comboDropBoxable.createButton();
    
    //this.assertInstanceOf(Psc.UI.Button, button = comboDropBoxable.getButton());
    this.assertEquals({primary: 'ui-icon-plus', secondary: null}, $button.button('option','icons'), 'icons are correct');
  });
});