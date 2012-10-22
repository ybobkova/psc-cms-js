define(['Psc/CMS/Item','Psc/UI/Tab','Psc/Code','Psc/CMS/TabOpenable', 'Psc/CMS/DropBoxButtonable', 'Psc/CMS/Buttonable', 'Psc/CMS/Identifyable','Psc/UI/DropBoxButton', 'Psc/UI/WidgetWrapper','Psc/CMS/TabButtonable'], function() {
  
  module("Psc.CMS.Item", {
    setup: function () {
      
    }
  });

  asyncTest("acceptance", function() {
    start();
      
      var j = new Psc.CMS.Item({
        traits: [Psc.CMS.TabOpenable,Psc.CMS.Buttonable,Psc.CMS.Identifyable],
        tab: {"id":"entities-article-0-form","label":"Psc\\Doctrine\\Entity<Psc\\Doctrine\\TestEntities\\Article> []","url":"\/entities\/article\/0\/form"},
        button: {"label":"Psc\\Doctrine\\Entity<Psc\\Doctrine\\TestEntities\\Article> []","fullLabel":"Psc\\Doctrine\\Entity<Psc\\Doctrine\\TestEntities\\Article> []"},
        identifier: null,
        entityName: "article",
        widget: $('<button></button>')
      });
      
      assertInstanceOf(Psc.CMS.Item, j);
      assertInstanceOf(Psc.UI.Tab, j.getTab());
      
      assertTrue(Psc.Code.isRole(j, Psc.CMS.Buttonable));
      assertTrue(Psc.Code.isRole(j, Psc.CMS.TabOpenable));
  });
  
  asyncTest("TabButtonable includes TabOpenable, Buttonable", function () {
      var $widget = $('<button></button>');
      var j = new Psc.CMS.Item({
        traits: [Psc.CMS.TabButtonable,Psc.CMS.Identifyable],
        tab: {"id":"entities-article-0-form","label":"Psc\\Doctrine\\Entity<Psc\\Doctrine\\TestEntities\\Article> []","url":"\/entities\/article\/0\/form"},
        button: {"label":"Psc\\Doctrine\\Entity<Psc\\Doctrine\\TestEntities\\Article> []","fullLabel":"Psc\\Doctrine\\Entity<Psc\\Doctrine\\TestEntities\\Article> []"},
        identifier: null,
        entityName: "article",
        widget: $widget
      });
      
      
    assertTrue(Psc.Code.isRole(j, Psc.CMS.TabButtonable), 'is tabButtoanble');
    assertTrue(Psc.Code.isRole(j, Psc.CMS.Buttonable), 'is buttonable');
    assertTrue(Psc.Code.isRole(j, Psc.CMS.TabOpenable), 'is tabopenable');
    
    var joose = Psc.UI.WidgetWrapper.unwrapWidget($widget, Psc.CMS.TabOpenable);
    // wrapper kann jetzt auch roles
    
    start();
  })


  asyncTest("is role", function() {
    start();
      var j = new Psc.CMS.Item({
        traits: [Psc.CMS.DropBoxButtonable],
        tab: {"id":"entities-article-0-form","label":"Psc\\Doctrine\\Entity<Psc\\Doctrine\\TestEntities\\Article> []","url":"\/entities\/article\/0\/form"},
        button: {"label":"Psc\\Doctrine\\Entity<Psc\\Doctrine\\TestEntities\\Article> []","fullLabel":"Psc\\Doctrine\\Entity<Psc\\Doctrine\\TestEntities\\Article> []"},
        identifier: null,
        entityName: "article",
        widget: $('<button></button>')
      });
      
    assertTrue(Psc.Code.isRole(j, Psc.CMS.DropBoxButtonable));
    assertTrue(Psc.Code.isRole(j, Psc.CMS.TabOpenable));
    assertTrue(Psc.Code.isRole(j, Psc.CMS.Identifyable));
    
    assertTrue(Psc.Code.isRole(j.getDropBoxButton(), Psc.UI.DropBoxButton), 'Item.getDropBoxButton() ist ein Psc.UI.DropBoxButton');
  });
});