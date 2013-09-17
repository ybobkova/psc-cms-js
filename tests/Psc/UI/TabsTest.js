define(['psc-tests-assert','text!fixtures/tabs.html','text!fixtures/tabs-for-main.html', 'test-setup', 'Psc/UI/Tabs','Psc/UI/Tab','Psc/UI/Menu'], function(t, html, tabsHtml, testSetup) {
  
  module("Psc.UI.Tabs");
  
  var setup = function(test) {
    var tab = new Psc.UI.Tab({
      id: 'entity-persons-17',
      label: 'Philipp S',
      url: '/entities/persons/17/form'
    });
    
    var otherTab = new Psc.UI.Tab({
      id: 'entity-persons-19',
      label: 'IS',
      url: '/entities/persons/19/form'
    });

    // hack
    sessionStorage.removeItem('psc-cms-ui-pinned-tabs');

    var $fixture = $('#qunit-fixture').html(html);
    var $tabs = $fixture.find('div.psc-cms-ui-tabs');
    var tabs = new Psc.UI.Tabs({ widget: $tabs, container:  testSetup.dm.getContainer()});
    var ret = t.setup(test, { tabs: tabs, tab: tab, otherTab: otherTab});
    
    test.assertEquals($tabs.length,1,'self-test: Fixture hat div.psc-cms-ui-tabs im html des Ajax Requests');
    test.assertSame($tabs, tabs.unwrap());

    return ret;
  };
  
  test("tab parsing", function() {
    setup(this);
    var welcome;
    // check welcome tab (parsing)
    this.assertInstanceOf(Psc.UI.Tab, welcome = this.tabs.tab({index: 0}));
    this.assertEquals('Willkommen', welcome.getLabel());
    this.assertEquals('tab-content0', welcome.getId());
    this.assertFalse(welcome.isClosable(),'welcome cannot be closed');
    
    this.assertEquals(0, this.tabs.getIndex());
    this.assertEquals(1, this.tabs.count(), 'one tab should be parsed');
  });
    
  test("has", function() {
    var that = setup(this), tabs = this.tabs;
    // has
    this.assertFalse(tabs.has(),'has with empty');
    this.assertFalse(tabs.has({index: null}),'has() returns false with null as index');
    this.assertFalse(tabs.has({index: 2}),'has() returns false with not-existing index');
    this.assertTrue(tabs.has({index: 0}),'has() returns true with existing index');
  });
  
  test("add a tab and get his index", function() {
    var that = setup(this), tabs = this.tabs, tab = this.tab;
    
    tabs.add(tab);
    this.assertTrue(tab.isClosable(),'normal tab is closable');    
    
    // index + count
    this.assertEquals(1, tabs.getIndex());
    this.assertEquals(2, tabs.count());
    this.assertEquals(1, tabs.getIndex(tab));
  
    // now it has the tab
    this.assertTrue(tabs.has(tab));
    
    // but not another
    this.assertFalse(tabs.has(this.otherTab));
  });
  
  
  test("close and isClosable", function() {
    var that = setup(this), tabs = this.tabs, tab = this.tab;
    tabs.add(tab);
    this.assertTrue(tab.isClosable(),'normal tab is closable');
    
    this.assertFalse(tabs.tab({index:0}).isClosable(), 'welcome tab is not closable');
  });
  
  test("search for a tab", function() {
    var that = setup(this), tabs = this.tabs, tab = this.tab;
    tabs.add(tab);
    
    // search
    this.assertSame(tab, tabs.tab({id: 'entity-persons-17'}));
    this.assertSame(tab, tabs.tab({index: tabs.getIndex()}));
    
    QUnit.raises(function () {
      tabs.tab({id: 'none'});
    });
    QUnit.raises(function () {
      tabs.tab({index: 2});
    });
    QUnit.raises(function () {
      tabs.tab({index: -1});
    });
  });
  
  test("search for tab with special chars", function() {
    var that = setup(this), tabs = this.tabs;
    var spTab = new Psc.UI.Tab({"id":"entities-user-info@ps-webforge.comd-form",
          "label":"Psc\\Doctrine\\Entity<Entities\\User> [info@ps-webforge.comd]",
          "url":"\/entities\/user\/info@ps-webforge.comd\/form"}
        );
    
    tabs.add(spTab);
    this.assertSame(spTab, tabs.tab({id: 'entities-user-info@ps-webforge.comd-form'}));
  });
    
  test("select a tab and open adds and selects tabs", function() {
    var that = setup(this), tabs = this.tabs, $tabs = tabs.unwrap(), tab = this.tab;
    
    tabs.add(tab);
    var selected = function() {
      return $tabs.tabs('option','selected');
    };
    
    // select
    this.assertEquals(0, selected(), 'pre-condition: nativer index entspricht nicht dem erwarteten');
    tabs.select(tab);
    // native test
    this.assertEquals(1, selected(), 'nativer index entspricht nicht dem erwarteten');
    
    // "open" a new tab. the first one just adds it
    tabs.open(this.otherTab);
    this.assertEquals(2, tabs.getIndex(this.otherTab));
    
    // tab is not selected
    this.assertEquals(1, selected(), 'nativer index ist noch 1');
    // tab is added
    this.assertEquals(3, tabs.count()); // tab,othertab,welcome
    this.assertTrue(tabs.has(this.otherTab),'has() gibt für den open tab true zurück');
    // native test isSelected?
    this.assertEquals(1, $tabs.find('ul li a[href="#entity-persons-19"]').length,' tab wurde geöffnet und hinzugefügt (dom)');
    
    //  "open" the second selects it
    tabs.open(this.otherTab);
    this.assertEquals(2, selected(),'tab was selected the second time');
  });

  test("select a tab sets error context info in _err", function() {
    var that = setup(this), tabs = this.tabs, $tabs = tabs.unwrap(), tab = this.tab;

    window._errs = {};
    
    tabs.add(tab);
    tabs.select(tab);

    this.assertEquals(
      tab.getLabel()+' '+tab.getUrl(),
      window._errs.meta.tab,
      'tabs should set errors meta info'
    );
  });
  
  test("has searches by id not by reference", function() {
    var that = setup(this), tabs = this.tabs, tab = this.tab;
    
    tabs.add(tab);
    
    var sameTab = new Psc.UI.Tab({
      id: tab.getId(),
      label: tab.getLabel(),
      url: tab.getUrl()
    });
    
    this.assertTrue(tabs.has(sameTab), 'sameTab is (with the same id) in tabs');
  });
  
  test("mark tabs unsaved and saved. ", function() {
    var that = setup(this), tabs = this.tabs, $tabs = tabs.unwrap(), tab = this.tab, otherTab = this.otherTab;
    
    tabs.add(tab);
    tabs.add(otherTab);
    
    // mark unsaved and then saved
    this.assertFalse(tab.isUnsaved());
    tabs.unsaved(tab);
    this.assertTrue(tab.isUnsaved());
    tabs.saved(tab);
    this.assertFalse(tab.isUnsaved());
    
    // close from code (tab)
    tabs.close(tab);
    this.assertEquals(2, tabs.count());
    
    // close from click (otherTab), otherTab wurde ganz sicher hinzugefügt, d.h. die eventhandler klappen auch für sich veränderne elemente
    $tabs.find('ul li a[href="#entity-persons-19"]').nextAll('span.ui-icon-close').trigger('click');
    this.assertEquals(1, tabs.count(),'count ist jetzt 1 nachdem auf close gelickt wurde');
  });
  
  test("tabsAll closes (nearly) all tabs", function() {
    var that = setup(this), tabs = this.tabs, tab = this.tab, otherTab = this.otherTab;
    
    tabs.add(tab);
    tabs.add(otherTab);
    this.assertEquals(3, tabs.count(),'3 tabs are there (1 fixture + 2 real)'); // 3 denn auch welcome
    
    tabs.closeAll();
    this.assertEquals(1, tabs.count(),'1 tabs is avaible after closeAll() because it is not closable');
    this.assertFalse(tabs.tab({index:0}).isClosable(), 'tab is really not closable');
  });
  
  test("tabs gets added with contextMenu", function() {
    var that = setup(this), tabs = this.tabs, $tabs = tabs.unwrap(), tab = this.tab, otherTab = this.otherTab;
    tabs.add(tab);
    
    this.assertEquals(2, tabs.count(),'tabs count is 2');
    var $li = $tabs.find('li:has(a[href="#entity-persons-17"])');
    var $span = $li.find('span.options');
    this.assertEquals(1, $span.length, 'options span gefunden');
    
    // is registered in manager
    var menu = tabs.getContextMenuManager().get($span);
    
    this.assertInstanceOf(Psc.UI.Menu, menu);
  });
  
  test("tabs gets parsed with contextMenu", function() {
    var that = setup(this);
    // nehme das fixture aus index.php (denn dashat 3 tabs sogar buttons)
    this.tabs = new Psc.UI.Tabs({ widget: $(tabsHtml), container:  testSetup.dm.getContainer()});
    var $tabs = this.tabs.unwrap();
    
    var $li = $tabs.find('li:has(a[href="#tabs-3"])');
    var $span = $li.find('span.options');
    this.assertEquals(1, $span.length, '.options span in fixture gefunden');
    
    var menu = this.tabs.getContextMenuManager().get($span);
    this.assertInstanceOf(Psc.UI.Menu, menu);
    
    $span.trigger('click');
  });
  
  test("TODO: tabs trigger remote-tab-loaded after loading a remote tab with success", function() {
    t.setup(this);
    this.assertTrue(true, 'test incomplete');
  });

  test("TODO: tabs trigger remote-tab-load before loading a remote tab", function() {
    t.setup(this);
    this.assertTrue(true, 'test incomplete');
  });
  
  test("tabs stores pinned tabs in sessionStorage (just a small acceptance here)", function () {
    var that = setup(this);
        
    this.assertEquals(0, this.tabs.getPinnedTabs().length, 'there are no tabs pinned');
    this.tabs.pinn(this.tab);
    
    // has added
    this.assertEquals(1, this.tabs.getPinnedTabs().length, 'there is one tab pinned');
    this.assertEquals(this.tab.getExport(), this.tabs.getPinnedTabs()[0], 'the tab is exported');
    
    // does not add twice
    this.tabs.pinn(this.tab);
    this.assertEquals(1, this.tabs.getPinnedTabs().length, 'there is still only one tab pinned');
    
    this.tabs.pinn(this.otherTab);
    this.assertEquals(2, this.tabs.getPinnedTabs().length, 'there is still only one tab pinned');
    
    this.tabs.unpinn(this.tab);
    this.assertEquals(1, this.tabs.getPinnedTabs().length, 'there is still only one tab pinned');
  });
});