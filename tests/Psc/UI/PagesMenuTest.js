define(['psc-tests-assert', 'fixtures/navigation.comun.flat', 'jquery-simulate', 'Psc/UI/Group', 'Psc/UI/PagesMenu'], function(t, flat) {
  
  module("Psc.UI.PagesMenu");
  
  var setup = function (test) {
    var $widget = $('<div />');
    
    var group = new Psc.UI.Group({
      label: 'Seiten verwalten',
      content: $widget
    });
    
    var tabs = [];
    var uiController = {
      openTab: function (entityName, identifier) {
        tabs.push({
          name: entityName,
          id: identifier
        });
      }
    };
    
    $('#visible-fixture').html(group.html());
    
    var pages = new Psc.UI.PagesMenu({
      uiController: uiController,
      widget: $widget,
      flat: flat
    });
    
    return t.setup(test, {pages: pages, $widget: $widget, tabs: tabs});
  };

  test("jqxMenu is created in widget", function() {
    var that = setup(this);
    
    var $menu = this.assertjQueryIs('.jqx-menu.jqx-menu-horizontal', this.$widget);
  });
  
  asyncTest("on click on item the select-page is triggered and tabOpen is called for uiController", function () {
    var that = setup(this);
    
    var $menu = this.assertjQueryIs('.jqx-menu.jqx-menu-horizontal', this.$widget);
    var $item = this.assertjQueryLength(1, $menu.find('li#52'));
    
    this.pages.getEventManager().on('select-node', function (e, node) {
      that.assertEquals(52, node.id);
      
      stop();
      setTimeout(function afterEventNotDefaultPrevented() {
        that.assertEquals([{name: 'page', id: 20}], that.tabs, 'uiController openTab should be called');
        
        start();
      }, 20); 
      
      start();
    });
    
    $item.simulate('click');
  });
});