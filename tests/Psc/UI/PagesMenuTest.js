define(['psc-tests-assert', 'fixtures/navigation.comun.flat', 'jquery-simulate', 'Psc/UI/Group', 'Psc/UI/PagesMenu'], function(t, flat) {
  
  module("Psc.UI.PagesMenu");
  
  var setup = function (test) {
    var $widget = $('<div />');
    
    var group = new Psc.UI.Group({
      label: 'Seiten verwalten',
      content: $widget
    });
    
    var uiController = {
      openTab: function (entityName, identifier) {
        test.openedTabs.push({
          name: entityName,
          id: identifier
        });
      },

      openTabsSelection: function (title, tabButtonItems, dialogAttributes) {
        test.selection = {
          title: title,
          tabButtonItems: tabButtonItems,
          dialogAttributes: dialogAttributes
        };
      },

      createTabButtonItem: function (tab, button) {
        return {
          tab: tab,
          button: button
        };
      },
      tab: function () {
        return arguments;
      },
      button: function () {
        return arguments;
      }
    };
    
    $('#visible-fixture').html(group.html());
    
    var pages = new Psc.UI.PagesMenu({
      uiController: uiController,
      widget: $widget,
      flat: flat
    });
    
    return t.setup(test, {pages: pages, $widget: $widget, openedTabs: [], selection: undefined});
  };

  test("jqxMenu is created in widget", function() {
    var that = setup(this);
    
    var $menu = this.assertjQueryIs('.jqx-menu.jqx-menu-horizontal', this.$widget);
  });
  
  asyncTest("on click on item the select-page is triggered and openTabsSelection is called for uiController", function () {
    var that = setup(this);
    
    var $menu = this.assertjQueryIs('.jqx-menu.jqx-menu-horizontal', this.$widget);
    var $item = this.assertjQueryLength(1, $menu.find('li#52'));
    
    this.pages.getEventManager().on('select-node', function (e, node) {
      that.assertEquals(52, node.id);
      
      stop();
      setTimeout(function afterEventNotDefaultPrevented() {
        that.assertNotUndefined(that.selection, 'openTabsSelection should have been called');
        
        that.assertEquals(3, that.selection.tabButtonItems.length, 'cs1, cs2 and page buttons are avaible');
        
        start();
      }, 20); 
      
      start();
    });
    
    $item.simulate('click');
  });
});