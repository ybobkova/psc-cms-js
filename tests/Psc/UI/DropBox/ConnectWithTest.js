define(['Psc/UI/Main','Psc/UI/Dragger','Psc/UI/Tabs','Psc/UI/DropBox','Psc/UI/DropBoxButton','Psc/CMS/Item', 'Psc/CMS/TabOpenable', 'Psc/CMS/Buttonable', 'Psc/CMS/Identifyable','Psc/CMS/DropBoxButtonable'], function() {
  
  var main, $dropbox1, $dropbox2, dropBox1, dropBox2, drag;

  module("Psc.UI.DropBox ConnectWithTest", {
    setup: function () {
      main = fixtures.getMain();
      
      main.getEventManager().setLogging(true);
      
      stop();
      $.get('/js/fixtures/dropboxes.connected.php', function (html) {
        $fixture = $('#visible-fixture').empty();
        $fixture.append(html);
        
        $dropBox1 = $fixture.find('div#drop-box1 div.psc-cms-ui-drop-box');
        $dropBox2 = $fixture.find('div#drop-box2 div.psc-cms-ui-drop-box');
        
        $.psc.resolve(main);
        
        // führe alle inline elemente aus
        $.when( main.getLoader().finished() ).then(function () {
          dropBox1 = $dropBox1.data('joose');
          dropBox2 = $dropBox2.data('joose');
          
          drag = new Psc.UI.Dragger();
          
          start();
        });
      });
    }, teardown: function  () {
      delete main, dropBox1, dropBox2, $dropBox1, $dropBox2;
      $.psc.reset();
    }
  });
  
  asyncTest("fixture test: drop boxes are loaded from js, with buttons", function () {
    assertEquals(1, $dropBox1.length);
    assertEquals(1, $dropBox2.length);
    
    assertInstanceOf(Psc.UI.DropBox, dropBox1, 'dropBox1 is a UI DropBox');
    assertInstanceOf(Psc.UI.DropBox, dropBox2, 'dropBox2 is a UI DropBox');
    
    assertEquals(1, ($button1 = $dropBox1.find('button.psc-cms-ui-button')).length, 'button is in dropBox1');
    assertEquals(1, ($button2 = $dropBox2.find('button.psc-cms-ui-button')).length, 'button is in dropbox2');

    assertTrue(dropBox1.hasButton($button1),'db1 has button1');
    assertTrue(dropBox2.hasButton($button2), 'db2 has button2');
    
    // connected hier über Kreuz connecten geht nicht (witziger weise)
    assertEquals('div.psc-cms-ui-drop-box', dropBox1.unwrap().sortable('option', 'connectWith'), 'dropbox1 is connected to all');
    assertEquals('div.psc-cms-ui-drop-box', dropBox2.isConnectedWith(), 'dropbox1 is connected to all');
    start();
  });
  
  asyncTest("sorting from box1 to box2 changes DOM", function () {
    $button2 = $dropBox2.find('button.psc-cms-ui-button');
    
    drag.toElement($button2, $dropBox1);
    
    assertTrue(dropBox1.hasButton($button2), 'dropbox1 has received button2');
    assertEquals(2, $dropBox1.find('button.psc-cms-ui-button').length, 'has now 2 buttons');
    assertFalse(dropBox2.hasButton($button2), 'dropbox2 has given button2 away');
    assertEquals(0, $dropBox2.find('button.psc-cms-ui-button').length, 'has now 0 buttons');
    start();
  });
  
  asyncTest("after sorting new buttons can be deleted", function () {
    $button2 = $dropBox2.find('button.psc-cms-ui-button');
    $button1 = $dropBox1.find('button.psc-cms-ui-button');
    
    drag.toElement($button2, $dropBox1);
    assertTrue(dropBox1.hasButton($button2),'dropbox1 has received button2');
    
    // entfernt beide aus der box
    dropBox1.removeButton($button1);
    $button2.simulate('click');
    
    assertEquals(0, $dropBox1.find('button').length, 'kein button mehr da');
    assertFalse(dropBox1.hasButton($button2), 'button2 can be removed');
    start();
  });
  
  
  asyncTest("after sorting new buttons can be deleted", function () {
    $button2 = $dropBox2.find('button.psc-cms-ui-button');
    
    
    drag.toElement($button2, $dropBox1);
  });
});