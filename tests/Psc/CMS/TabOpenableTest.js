use(['Psc.CMS.TabOpenable','Psc.CMS.Item','Psc.UI.Tab'], function() {
  
  module("Psc.CMS.TabOpenable", {
    setup: function () {
      
    }
  });

  test("acceptance", function() {
    
    var tabOpenable = new Psc.CMS.Item({
      trait: Psc.CMS.TabOpenable,
      tab: {
        id: 'entities-person-17-form',
        url: '/entities/person/17/form',
        label: 'Person Nummer 17'
      },
      widget: $('<a></a>')
    });
    
    assertInstanceOf(Psc.UI.Tab, tab = tabOpenable.getTab());
    assertEquals('Person Nummer 17', tab.getLabel());
  
  });
});