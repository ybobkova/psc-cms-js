define(['psc-tests-assert','Psc/CMS/Item','Psc/UI/Tab','Psc/Code','Psc/CMS/TabOpenable', 'Psc/CMS/DropBoxButtonable', 'Psc/CMS/Buttonable', 'Psc/CMS/Identifyable','Psc/UI/DropBoxButton', 'Psc/UI/WidgetWrapper','Psc/CMS/TabButtonable'], function(t) {
  
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
      
      this.assertInstanceOf(Psc.CMS.Item, j);
      this.assertInstanceOf(Psc.UI.Tab, j.getTab());
      
      this.assertTrue(Psc.Code.isRole(j, Psc.CMS.Buttonable));
      this.assertTrue(Psc.Code.isRole(j, Psc.CMS.TabOpenable));
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
      
      
    this.assertTrue(Psc.Code.isRole(j, Psc.CMS.TabButtonable), 'is tabButtoanble');
    this.assertTrue(Psc.Code.isRole(j, Psc.CMS.Buttonable), 'is buttonable');
    this.assertTrue(Psc.Code.isRole(j, Psc.CMS.TabOpenable), 'is tabopenable');
    
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
      
    this.assertTrue(Psc.Code.isRole(j, Psc.CMS.DropBoxButtonable));
    this.assertTrue(Psc.Code.isRole(j, Psc.CMS.TabOpenable));
    this.assertTrue(Psc.Code.isRole(j, Psc.CMS.Identifyable));
    
    this.assertTrue(Psc.Code.isRole(j.getDropBoxButton(), Psc.UI.DropBoxButton), 'Item.getDropBoxButton() ist ein Psc.UI.DropBoxButton');
  });
});