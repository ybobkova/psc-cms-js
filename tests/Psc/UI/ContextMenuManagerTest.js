define(['psc-tests-assert','Psc/UI/ContextMenuManager','Psc/UI/Menu'], function(t) {
  module("Psc.UI.ContextMenuManager");
  
  var setup = function(test) {
    return t.setup(test);
  };

  test("acceptance", function() {
    setup(this);
    var manager = new Psc.UI.ContextMenuManager({ });
  
    var $anchor = $('<span class="ui-icon-gear"></span>');
    $anchor.appendTo($('#qunit-fixture'));
    
    var menuOpen = false;
    var MenuMockClass = Joose.Class({
      isa: Psc.UI.Menu,
      
      after: {
        open: function() {
          menuOpen = true;
        },
        close: function() {
          menuOpen = false;
        }
      }
    });
    var menu = new MenuMockClass({
      items: {
        'pinn': 'Permanent Anpinnen',
        'close-all': 'Alle Tabs Schließen',
        'save': 'Speichern'
      }
    });

    manager.register($anchor, menu);
    this.assertSame(menu, manager.get($anchor));
    
    QUnit.raises(function () {
      manager.get($('body'));
    });
    
    $anchor.on('click', function (e) {
      e.preventDefault();
      manager.toggle($anchor);
    });
    
    this.assertFalse(menuOpen);
    $anchor.trigger('click');
    
    this.assertTrue(menu.unwrap().parents('body').length >= 1,'menu is appended somehow somewhere');
    this.assertTrue(menuOpen,'menu is opened through toggle');
    
    $anchor.trigger('click');
    this.assertFalse(menuOpen,'menu is closed through toggle');
    
    manager.unregister($anchor);
  });
  
  
  test("manager cleans up his mess", function() {
    setup(this);
    var manager = new Psc.UI.ContextMenuManager({ });
  
    var $anchor = $('<span class="ui-icon-gear"></span>');
    $anchor.appendTo($('#qunit-fixture'));

    var menuOpen = false;
    var menu = new Psc.UI.Menu({
      items: {
        'pinn': 'Permanent Anpinnen',
        'close-all': 'Alle Tabs Schließen',
        'save': 'Speichern'
      }
    });

    manager.register($anchor, menu);
    $anchor.trigger('click');
    this.assertEquals(1, menu.unwrap().parents('body').length,'menu is appended somehow somewhere');
    
    manager.unregister($anchor);
    this.assertEquals(0, menu.unwrap().parent().length);
  });
});