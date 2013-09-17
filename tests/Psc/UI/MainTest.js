define(['psc-tests-assert', 'joose', 'text!fixtures/tabs-for-main.html', 'Psc/Test/DoublesManager', 'Psc/UI/Main', 'Psc/UI/Tabs', 'Psc/UI/Tab', 'Psc/EventManager', 'Psc/EventManagerMock', 'Psc/Response', 'Psc/ResponseMetaReader', 'Psc/UI/FormController'], function(t, Joose, tabsHTML) {
  module("Psc.UI.Main");

  var setup = function(test) {
    var $cmsContent = $('#qunit-fixture').empty().append(tabsHTML);
    var $tabs = $cmsContent.find('div.psc-cms-ui-tabs:eq(0)'); // das erste tabs objekt wird unser main tab

    var main = new Psc.UI.Main({
      translator: (new Psc.Test.DoublesManager()).getTranslator(),
      tabs: new Psc.UI.Tabs({
        widget: $tabs
      })
    });

    return t.setup(test, {
      main: main,
      tabs: main.getTabs()
    });
  };

  var formSetup = function(test) {
    test = setup(test);
    var main = test.main,
      $tabs = test.tabs.unwrap();

    main.attachHandlers();
    main.getEventManager().setLogging(true);

    test.$saveButton = test.assertjQueryLength(1, $tabs.find('#tabs-3 button.psc-cms-ui-button-save'), 'save-button was found in fixture');
    test.$tabForm = test.assertjQueryLength(1, $tabs.find('#tabs-3 .psc-cms-ui-form'), 'form was found in fixture');

    return test;
  };

  test("constructInitsEventManager", function() {
    setup(this);
    this.assertInstanceOf(Psc.EventManager, this.main.getEventManager());
  });

  test("constructInitsFormHandler", function() {
    setup(this);
    this.assertInstanceOf(Psc.AjaxFormHandler, this.main.getAjaxFormHandler());
  });

  test("constructCanBeInjectedWithEventManager", function() {
    var that = setup(this),
      tabs = this.tabs;
    var manager = new Psc.EventManager();
    var main = new Psc.UI.Main({
      eventManager: manager,
      tabs: tabs
    });

    this.assertInstanceOf(Psc.EventManager, main.getEventManager());
    this.assertSame(manager, main.getEventManager(), 'zurückgegebener manager ist der, der im Constructor übergeben wurde');
  });

  test("constructCanBeInjectedWithAjaxFormHandler", function() {
    var that = setup(this),
      tabs = this.tabs;
    var handler = new Psc.AjaxFormHandler();
    var main = new Psc.UI.Main({
      ajaxFormHandler: handler,
      tabs: tabs
    });

    this.assertInstanceOf(Psc.AjaxFormHandler, main.getAjaxFormHandler());
    this.assertSame(handler, main.getAjaxFormHandler(), 'zurückgegebener formHandler ist der, der im Constructor übergeben wurde');
  });

  test("constructNeedsTabsAsUIObject", function() {
    setup(this);
    QUnit.raises(function() {
      new Psc.UI.Main({
        tabs: null
      });
    });

    QUnit.raises(function() {
      new Psc.UI.Main({
        tabs: $()
      });
    });
  });

  var ResponseMetaMock = Joose.Class({
    isa: Psc.ResponseMetaReader,

    has: {
      response: {
        is: 'r',
        required: false,
        isPrivate: true
      },
      data: {
        is: 'rw',
        required: true,
        isPrivate: false
      }
    }
  });

  test("event-form-saved triggers tab-open from meta", function() {
    var that = setup(this),
      tabs = this.tabs;
    var managerMock = new Psc.EventManagerMock({
      allow: 'form-saved',
      denySilent: true
    });

    var main = new Psc.UI.Main({
      eventManager: managerMock,
      tabs: tabs
    });
    var $form = $('<form></form>');
    var tabHook;
    // wir injecten hier direkt die meta-daten die sonst aus der Response gelesen würden
    var meta = new ResponseMetaMock({
      data: {
        data: {
          tab: {
            id: 'new-tab-id',
            label: 'neuer Tab',
            url: '/not.avaible.html'
          }
        }
      }
    });

    main.attachHandlers(); // alle custom events werden gebindet, wir "filtern" aber durch den mock
    main.getEventManager().triggerEvent('form-saved', {}, [$form, meta, tabHook]);

    managerMock.wasTriggered('tab-open', 1, function(e, tab, $target) {
      that.assertInstanceOf(Psc.UI.Tab, tab);
      that.assertEquals('new-tab-id', tab.getId());
      that.assertEquals('neuer Tab', tab.getLabel());
      that.assertEquals('/not.avaible.html', tab.getUrl());

      that.assertEquals($form, $target, 'form wird als target übergeben');
    });
  });

  test("event-form-saved tabhook prevents tab-open", function() {
    var that = setup(this),
      tabs = this.tabs;
    var managerMock = new Psc.EventManagerMock({
      allow: 'form-saved',
      denySilent: true
    });

    var main = new Psc.UI.Main({
      eventManager: managerMock,
      tabs: tabs
    });
    var $form = $('<form></form>');
    var tabHook = function() {
      return false;
    };
    // wir injecten hier direkt die meta-daten die sonst aus der Response gelesen würden
    var meta = new ResponseMetaMock({
      data: {
        data: {
          tab: {
            id: 'new-tab-id',
            label: 'neuer Tab',
            url: '/not.avaible.html'
          }
        }
      }
    });

    main.attachHandlers(); // alle custom events werden gebindet, wir "filtern" aber durch den mock
    main.getEventManager().triggerEvent('form-saved', {}, [$form, meta, tabHook]);

    this.assertTrue(managerMock.wasTriggered('tab-open', 0), 'tab-open was not triggered allthough tabHook returns false');
  });

  test("event-form-saved triggers tab-close from meta", function() {
    var that = setup(this),
      tabs = this.tabs;
    var managerMock = new Psc.EventManagerMock({
      allow: 'form-saved',
      denySilent: true
    });

    var main = new Psc.UI.Main({
      eventManager: managerMock,
      tabs: tabs
    });
    var $form = $('<form></form>').appendTo(tabs.unwrap().find('#tabs-3'));
    var tabHook;
    // wir injecten hier direkt die meta-daten die sonst aus der Response gelesen würden
    var meta = new ResponseMetaMock({
      data: {
        data: {
          tab: {
            close: true
          }
        }
      }
    });

    main.attachHandlers(); // alle custom events werden gebindet, wir "filtern" aber durch den mock
    main.getEventManager().triggerEvent('form-saved', {}, [$form, meta, tabHook]);
    this.assertTrue(managerMock.wasTriggered('tab-close', 1), 'tab-close was triggered through meta');
  });

  test("button in tab can trigger reload", function() {
    var that = setup(this),
      main = this.main;
    var $tabs = main.getTabs().unwrap();

    var $button = $tabs.find('#tabs-3 button.psc-cms-ui-button-reload');
    this.assertEquals(1, $button.length, 'reload-button was found in fixture');

    main.getEventManager().on('tab-reload', function(e, tab, $target) {
      that.assertInstanceOf(Psc.UI.Tab, tab, 'tab is an instance of Psc.UI.Tab');
      that.assertEquals(tab.getId(), "tabs-3");
    });

    $button.trigger('reload');
  });

  test("button in tab can trigger save", function() {
    expect(6);

    var that = setup(this),
      main = this.main;
    var $tabs = this.tabs.unwrap();

    main.attachHandlers();
    main.getEventManager().setLogging(true);

    var $button = $tabs.find('#tabs-3 button.psc-cms-ui-button-save');
    var $tabForm = $tabs.find('#tabs-3 .psc-cms-ui-form');
    this.assertEquals(1, $button.length, 'save-button was found in fixture');
    this.assertEquals(1, $tabForm.length, 'form was found in fixture');

    main.getEventManager().on('form-save', function(e, $form, $target) {
      that.assertSame($tabForm.get(0), $form.get(0), 'form is given in event');
      that.assertSame($button.get(0), $target.get(0), 'button is given in event');
      that.assertTrue(true, "form-save event is triggered");
    });

    main.getEventManager().on('form-controller-create', function(e, controller) {
      that.assertInstanceOf(Psc.UI.FormController, controller, 'form-controller-create is triggered');

      // mock controller to not save actually
      controller.save = function() {};
    });

    $button.trigger('save');
  });

  test("button in tab can trigger save-close", function() {
    expect(6);

    var that = setup(this);

    var $tabs = this.main.getTabs().unwrap();
    $('#visible-fixture').append($tabs);

    this.main.attachHandlers();

    var $button = $tabs.find('#tabs-3 button.psc-cms-ui-button-save');
    var $tabForm = $tabs.find('#tabs-3 .psc-cms-ui-form');
    this.assertEquals(1, $button.length, 'save-button was found in fixture');
    this.assertEquals(1, $tabForm.length, 'form was found in fixture');

    this.main.getEventManager().on('form-save-close', function(e, $form, $target) {
      that.assertSame($tabForm.get(0), $form.get(0), 'form is given in event');
      that.assertSame($button.get(0), $target.get(0), 'button is given in event');
      that.assertTrue(true, "form-save-close event is triggered");
    });

    this.main.getEventManager().on('form-controller-create', function(e, controller) {
      that.assertInstanceOf(Psc.UI.FormController, controller, 'form-controller-create is triggered');

      // mock controller to not save actually
      controller.save = function() {};
    });

    $button.trigger('save-close');
  });

  test("when generalEvents are triggered from a Tab main transforms the $tab to the right tab", function() {
    var that = setup(this),
      tabs = this.tabs;
    var managerMock = new Psc.EventManagerMock({
      allow: 'unsaved', // nur so als beispiel, da die alle denselben handler haben
      denySilent: true
    });
    managerMock.setLogging(true);

    var main = new Psc.UI.Main({
      eventManager: managerMock,
      tabs: tabs
    });
    main.attachHandlers();

    var $tab3 = tabs.unwrap().find('#tabs-3');
    $('<form><div class="somemarkup"><input class="guid1" type="text" /></div></form>').appendTo($tab3);
    var $input = $tab3.find('input.guid1');
    $input.trigger('unsaved');

    var eventTab, $eventTarget;
    managerMock.wasTriggered('tab-unsaved', 1, function(e, tab, $target) {
      eventTab = tab;
      $eventTarget = $target;
    });

    // the tab from which unsaved was fired
    this.assertSame($input[0], $eventTarget[0], 'target aus dem tab-unsaved event ist dasselbe wie das target von unsaved');
    this.assertEquals('tabs-3', eventTab.getId(), 'eventTab ist der richtige');
  });

  test("registers an object and has it in registered()", function() {
    setup(this);
    var object = {
      id: 17,
      label: 'my nice object'
    };

    this.main.register(object, "cat");
    this.assertEquals([object], this.main.getRegistered("cat"));

    // defaultCat
    this.main.register(object);
    this.assertEquals([object], this.main.getRegistered("none"));
  });

  test("TODO: shows/hides spinner on tab remote load", function() {
    t.setup(this);
    this.assertTrue(true, 'test incomplete');
  });

  test("TODO: hides spinner on successful tab load and error load", function() {
    t.setup(this);
    this.assertTrue(true, 'test incomplete');
  });

  test("TODO: save and save-close delegates postData until formcontroller", function() {
    t.setup(this);
    this.assertTrue(true, 'test incomplete');
  });

  test("response with view in linkrelations and preview saved revision opens a new window", function() {
    var that = formSetup(this),
      main = that.main;

    var metaResponse = new Psc.ResponseMetaReader({
      response: undefined,
      data: {
        revision: 'preview-1172',
        links: [{
          rel: 'view',
          href: '/articles/7'
        }]
      }
    });

    var opened = false;
    main.getUIController().openWindow = function(url) {
      opened = true;

      that.assertEquals(
        '/articles/7?revision=preview-1172',
      url);
    };

    main.getEventManager().trigger('form-saved', [that.$tabForm, metaResponse, undefined]);

    this.assertTrue(opened, 'uiController openWindow() was called');

  });

  test("preview button in tab triggers save but with hacked revision prefixed with preview", function() {
    var that = formSetup(this),
      main;

    main = that.main;

    // mock save from main to do nothing
    main.save = function($form, tabHook, additionalData, revision) {
      that.assertContains(
        'preview-',
      revision,
        'revision field is hacked in formular to have a preview revision');
    };

    var $button = that.assertjQueryLength(1, main.getTabs().unwrap().find('#tabs-3 button.psc-cms-ui-button-preview'));

    $button.trigger('click');
  });

  test("main returns a container", function() {
    var that = setup(this), main = that.main;

    this.assertInstanceOf(Psc.Container, main.getContainer());

  });
});