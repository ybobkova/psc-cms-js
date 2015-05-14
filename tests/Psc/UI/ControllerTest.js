define(['psc-tests-assert', 'Psc/UI/Controller', 'Psc/UI/Tab'], function(t) {
  
  module("Psc.UI.Controller");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var tabs = {
      open: function (tab) {
        test.openedTab = tab;
      }
    };
    
    var controller = new Psc.UI.Controller({
      tabs: tabs
    });

    var prefixController = new Psc.UI.Controller({
      tabs: tabs,
      prefix: ['api', 'product', 'test']
    });
    
    return t.setup(test, {controller: controller, prefixController: prefixController, openedTab: undefined});
  };
  
  asyncTest("openTab creates a tab and opens it in tabs", function() {
    var that = setup(this);
    
    $.when(this.controller.openTab('sound', 7, {label: "Label for the tab for sound 7"})).then(function (tab) {
      that.assertSame(tab, that.openedTab);
      that.assertInstanceOf(Psc.UI.Tab, that.openedTab);
      that.assertEquals('entities/sound/7/form', that.openedTab.getUrl());
        
      start();
    });
  });

  asyncTest("openTabsSelection creates a popup with tab buttons to select one from", function () {
    var that = setup(this), ui = this.controller;

    var tabButtons = [
      ui.createTabButtonItem(
        ui.tab('contentstream', 59, 'form', "Seiteninhalt: Ben Guerdane (FR)"),
        ui.button("Seiteninhalt f\u00fcr FR bearbeiten", 1)
      ),
      ui.createTabButtonItem(
        ui.tab('contentstream', 58, 'form', "Seiteninhalt: Ben Guerdane (DE)"),
        ui.button("Seiteninhalt f\u00fcr DE bearbeiten", 1)
      ),
      ui.createTabButtonItem(
        ui.tab('page', 4, 'form', "Seite: Ben Guerdane"),
        ui.button("Seiteninformationen f\u00fcr Ben Guerdane bearbeiten", 3)
      )
    ];

    $.when(this.controller.openTabsSelection("choose one!", tabButtons)).then(function (dialog) {
      var $dialog = dialog.unwrap();
      var $buttons = that.assertjQueryLength(3, $dialog.find('.psc-cms-ui-button'), 'three buttons are rendered');

      start();

      dialog.close();
    });
  });

  test("createTabButtonItem creates a FastItem with attached widget", function () {
    var that = setup(this), ui = this.controller;

    var tabButtonItem = ui.createTabButtonItem(
      ui.tab('contentstream', 59, 'form', "Seiteninhalt: Ben Guerdane (FR)"),
      ui.button("Seiteninhalt f\u00fcr FR bearbeiten", 1)
    );

    this.assertInstanceOf(Psc.CMS.FastItem, tabButtonItem);
    var $button = tabButtonItem.unwrap();
    this.assertNotUndefined($button);
    this.assertjQueryIs('.psc-cms-ui-button', $button);
    this.assertjQueryIs('.psc-cms-ui-tab-button-openable', $button);

    that.$widget.html($button);
  });

  test("createDropBoxButtonItem creates a FastItem with identifier and an attached widget", function () {
    var that = setup(this), ui = this.controller;

    var dropBoxButtonItem = ui.createDropBoxButtonItem(
      ui.tab('sound', 5, 'form', "Sound Flusspferd 'lacht' (2-TAF_0025)"),
      ui.button("Sound Flusspferd 'lacht' (2-TAF_0025)", 1, "volume-on"),
      5
    );

    this.assertInstanceOf(Psc.CMS.FastItem, dropBoxButtonItem);
    this.assertEquals("entities/sound/5/form", dropBoxButtonItem.getUrl());
    
    var $button = dropBoxButtonItem.unwrap();
    this.assertNotUndefined($button);
    this.assertjQueryIs('.psc-cms-ui-button', $button);
    this.assertjQueryIs('.psc-cms-ui-tab-button-openable', $button);

    that.$widget.html($button);
  });

  test("create tab respects the ui controller prefix which replaces entities", function() {
    var that = setup(this), ui = this.prefixController;
    var tab = ui.tab('page', 17, 'form', 'label');

    this.assertEquals("api/product/test/page/17/form", tab.url);
  });

  test("create tab can have subresource as array", function () {
    var that = setup(this), ui = this.controller;
    var tab = ui.tab('page', 17, ['contentstream', 'de'], 'Seiteninhalt von für DE');

    this.assertEquals("entities/page/17/contentstream/de", tab.url);

  });
});