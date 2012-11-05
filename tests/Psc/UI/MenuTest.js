define(['psc-tests-assert','Psc/UI/Menu'], function(t) {
  
  module("Psc.UI.Menu");
  
  var setup = function(test) {
    return t.setup(test);
  };

  test("acceptance", function() {
    setup(this);
    var html = "<ul>\n"+
    "		<li><a href='#pinn'>Permanent Anpinnen</a></li>\n"+
    "		<li><a href='#close-all'>Alle Tabs Schließen</a></li>\n"+
    "		<li><a href='#save'>Speichern</a></li>\n"+
    "	</ul>\n";
    
    var menu = new Psc.UI.Menu({
      items: {
        'pinn': 'Permanent Anpinnen',
        'close-all': 'Alle Tabs Schließen',
        'save': 'Speichern'
      }
    });
    
    var $menu = menu.unwrap();
    
    this.assertEquals(1, $menu.find('li a[href="#pinn"]').length);
    this.assertEquals(1, $menu.find('li a[href="#close-all"]').length);
    this.assertEquals(1, $menu.find('li a[href="#save"]').length);
    
    this.assertTrue($menu.data('menu') !== undefined);
    
    this.assertFalse(menu.isOpen(),' !isOpen() by default');
    menu.open();
    this.assertTrue(menu.isOpen(),'isOpen() after open()');
    menu.close();
    this.assertFalse(menu.isOpen(),'!isOpen() after close()');
  });
});