define(['psc-tests-assert','Psc/CMS/TabOpenable','Psc/CMS/Item','Psc/UI/Tab'], function(t) {
  
  module("Psc.CMS.TabOpenable");

  var setup = function (test) {
    return t.setup(test);
  };

  test("acceptance", function() {
    var that = setup(this), tab;
    
    var tabOpenable = new Psc.CMS.Item({
      trait: Psc.CMS.TabOpenable,
      tab: {
        id: 'entities-person-17-form',
        url: '/entities/person/17/form',
        label: 'Person Nummer 17'
      },
      widget: $('<a></a>')
    });
    
    this.assertInstanceOf(Psc.UI.Tab, tab = tabOpenable.getTab());
    this.assertEquals('Person Nummer 17', tab.getLabel());
  
  });
});