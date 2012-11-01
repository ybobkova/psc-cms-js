define(['psc-tests-assert','Psc/UI/Main','Psc/UI/Tabs','Psc/UI/Tab','Psc/EventManager','Psc/EventManagerMock','Psc/Response', 'Psc/ResponseMetaReader','Psc/UI/FormController'], function(t) {
  var main;
  var tabs;
  
  var setup = function(test) {
    tabs = new Psc.UI.Tabs({ widget: fixtures.loadHTML('ui-tabs') });
    main = new Psc.UI.Main({tabs: tabs});
    
    return t.setup(test, {main: main, tabs: tabs});
  };
  
  module("Psc.UI.Main");
  
  test("constructInitsEventManager", function() {
    setup(this);
    this.assertInstanceOf(Psc.EventManager, main.getEventManager());
  });

  test("constructInitsFormHandler", function() {
    setup(this);
    this.assertInstanceOf(Psc.AjaxFormHandler, main.getAjaxFormHandler());
  });

  test("constructCanBeInjectedWithEventManager", function() {
    setup(this);
    var manager = new Psc.EventManager();
    var main = new Psc.UI.Main({eventManager: manager, tabs: tabs});
    
    this.assertInstanceOf(Psc.EventManager, main.getEventManager());
    this.assertSame(manager, main.getEventManager(), 'zurückgegebener manager ist der, der im Constructor übergeben wurde');
  });

  test("constructCanBeInjectedWithAjaxFormHandler", function() {
    setup(this);
    var handler = new Psc.AjaxFormHandler();
    var main = new Psc.UI.Main({ajaxFormHandler: handler, tabs: tabs});
    
    this.assertInstanceOf(Psc.AjaxFormHandler, main.getAjaxFormHandler());
    this.assertSame(handler, main.getAjaxFormHandler(), 'zurückgegebener formHandler ist der, der im Constructor übergeben wurde');
  });
  
  test("constructNeedsTabsAsUIObject", function() {
    setup(this);
    raises(function() {
      new Psc.UI.Main({tabs: null});
    });

    raises(function() {
      new Psc.UI.Main({tabs: $()});
    });
  });

  var responseMetaMock = Class({
    isa: Psc.ResponseMetaReader,
      
    has: {
      response: { is : 'r', required: false, isPrivate: true },
      data: { is : 'rw', required: true, isPrivate: false }
    }
  });

  test("event-form-saved triggers tab-open from meta", function() {
    setup(this);
    var managerMock = new Psc.EventManagerMock({
      allow: 'form-saved',
      denySilent: true
    });
    
    var main = new Psc.UI.Main({eventManager: managerMock, tabs: tabs});
    var $form = $('<form></form>');
    var tabHook;
    // wir injecten hier direkt die meta-daten die sonst aus der Response gelesen würden
    var meta = new responseMetaMock({ data: {
      data: {
        tab: {
          id: 'new-tab-id',
          label: 'neuer Tab',
          url: '/not.avaible.html'
        }
      }
    }});
    
    main.attachHandlers(); // alle custom events werden gebindet, wir "filtern" aber durch den mock
    main.getEventManager().triggerEvent('form-saved', {}, [$form, meta, tabHook]);
    
    managerMock.wasTriggered('tab-open', 1, function(e, tab, $target) {
      this.assertInstanceOf(Psc.UI.Tab, tab);
      this.assertEquals('new-tab-id', tab.getId());
      this.assertEquals('neuer Tab', tab.getLabel());
      this.assertEquals('/not.avaible.html', tab.getUrl());
      
      this.assertEquals($form, $target, 'form wird als target übergeben');
    });
  });
  
  test("event-form-saved tabhook prevents tab-open", function() {
    setup(this);
    var managerMock = new Psc.EventManagerMock({
      allow: 'form-saved',
      denySilent: true
    });
    
    var main = new Psc.UI.Main({eventManager: managerMock, tabs: tabs});
    var $form = $('<form></form>');
    var tabHook = function () { return false; };
    // wir injecten hier direkt die meta-daten die sonst aus der Response gelesen würden
    var meta = new responseMetaMock({ data: {
      data: {
        tab: {
          id: 'new-tab-id',
          label: 'neuer Tab',
          url: '/not.avaible.html'
        }
      }
    }});
    
    main.attachHandlers(); // alle custom events werden gebindet, wir "filtern" aber durch den mock
    main.getEventManager().triggerEvent('form-saved', {}, [$form, meta, tabHook]);
    
    this.assertTrue(managerMock.wasTriggered('tab-open', 0),'tab-open was not triggered allthough tabHook returns false');
  });

  test("event-form-saved triggers tab-close from meta", function() {
    setup(this);
    var managerMock = new Psc.EventManagerMock({
      allow: 'form-saved',
      denySilent: true
    });
    
    var main = new Psc.UI.Main({eventManager: managerMock, tabs: tabs});
    var $form = $('<form></form>').appendTo(tabs.unwrap().find('#tabs-3'));
    var tabHook;
    // wir injecten hier direkt die meta-daten die sonst aus der Response gelesen würden
    var meta = new responseMetaMock({ data: {
      data: {
        tab: {
          close: true
        }
      }
    }});
    
    main.attachHandlers(); // alle custom events werden gebindet, wir "filtern" aber durch den mock
    main.getEventManager().triggerEvent('form-saved', {}, [$form, meta, tabHook]);
    this.assertTrue(managerMock.wasTriggered('tab-close', 1),'tab-close was triggered through meta');
  });
  
  test("button in tab can trigger reload", function() {
    setup(this);
    var $tabs = main.getTabs().unwrap();
    
    var $button = $tabs.find('#tabs-3 button.psc-cms-ui-button-reload');
    this.assertEquals(1, $button.length, 'reload-button was found in fixture');
    
    main.getEventManager().on('tab-reload', function (e, tab, $target) {
      this.assertInstanceOf(Psc.UI.Tab, tab,'tab is an instance of Psc.UI.Tab');
      this.assertEquals(tab.getId(), "tabs-3");
    });
    
    $button.trigger('reload');
  });

  test("button in tab can trigger save", function() {
    setup(this);
    var $tabs = main.getTabs().unwrap();
    expect(6);
    main.attachHandlers();
    main.getEventManager().setLogging(true);
    
    var $button = $tabs.find('#tabs-3 button.psc-cms-ui-button-save');
    var $tabForm = $tabs.find('#tabs-3 .psc-cms-ui-form');
    this.assertEquals(1, $button.length, 'save-button was found in fixture');
    this.assertEquals(1, $tabForm.length, 'form was found in fixture');
    
    main.getEventManager().on('form-save', function (e, $form, $target) {
      this.assertSame($tabForm.get(0), $form.get(0), 'form is given in event');
      this.assertSame($button.get(0), $target.get(0), 'button is given in event');
      this.assertTrue(true, "form-save event is triggered");
    });
    
    main.getEventManager().on('form-controller-create', function (e, controller) {
      this.assertInstanceOf(Psc.UI.FormController, controller, 'form-controller-create is triggered');
    });
    
    $button.trigger('save');
  });

  test("button in tab can trigger save-close", function() {
    setup(this);
    
    var $tabs = this.main.getTabs().unwrap();
    $('#visible-fixture').append($tabs);
    
    expect(6);
    this.main.attachHandlers();

    var $button = $tabs.find('#tabs-3 button.psc-cms-ui-button-save');
    var $tabForm = $tabs.find('#tabs-3 .psc-cms-ui-form');
    this.assertEquals(1, $button.length, 'save-button was found in fixture');
    this.assertEquals(1, $tabForm.length, 'form was found in fixture');
    
    this.main.getEventManager().on('form-save-close', function (e, $form, $target) {
      this.assertSame($tabForm.get(0), $form.get(0), 'form is given in event');
      this.assertSame($button.get(0), $target.get(0), 'button is given in event');
      this.assertTrue(true, "form-save-close event is triggered");
    });

    this.main.getEventManager().on('form-controller-create', function (e, controller) {
      this.assertInstanceOf(Psc.UI.FormController, controller, 'form-controller-create is triggered');
    });
    
    $button.trigger('save-close');
  });
  
  test("when generalEvents are triggered from a Tab main transforms the $tab to the right tab", function() {
    setup(this);
    var managerMock = new Psc.EventManagerMock({
      allow: 'unsaved', // nur so als beispiel, da die alle denselben handler haben
      denySilent: true
    });
    managerMock.setLogging(true);
    
    var main = new Psc.UI.Main({eventManager: managerMock, tabs: tabs});
    main.attachHandlers();
    
    var $tab3 = tabs.unwrap().find('#tabs-3');
    $('<form><div class="somemarkup"><input class="guid1" type="text" /></div></form>').appendTo($tab3);
    var $input = $tab3.find('input.guid1');
    $input.trigger('unsaved');
    
    var eventTab, $eventTarget;
    managerMock.wasTriggered('tab-unsaved', 1, function (e, tab, $target) {
      eventTab = tab;
      $eventTarget = $target;
    });
    
    // the tab from which unsaved was fired
    this.assertSame($input[0], $eventTarget[0], 'target aus dem tab-unsaved event ist dasselbe wie das target von unsaved');
    this.assertEquals('tabs-3',eventTab.getId(), 'eventTab ist der richtige');
  });
  
  test("registers an object and has it in registered()", function() {
    setup(this);
    var object = {id: 17, label: 'my nice object'};
    
    main.register(object, "cat");
    this.assertEquals([object], main.getRegistered("cat"));
    
    // defaultCat
    main.register(object);
    this.assertEquals([object], main.getRegistered("none"));
  });
  
  test("shows/hides spinner on tab remote load", function() {
    setup(this);
    fail('todo');
  });

  test("hides spinner on successful tab load and error load", function() {
    setup(this);
    fail('todo');
  });

  test("save and save-close delegates postData until formcontroller", function() {
    setup(this);
    fail('todo');
  });
});