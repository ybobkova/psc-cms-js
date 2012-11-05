define(['psc-tests-assert',
        'text!fixtures/dropBoxes-connected.html',
        'js/main',
        'Psc/UI/DropBox', 'Psc/UI/Dragger','Psc/UI/DropBox','Psc/UI/DropBoxButton','Psc/CMS/Item', 'Psc/CMS/TabOpenable', 'Psc/CMS/Buttonable', 'Psc/CMS/Identifyable','Psc/CMS/DropBoxButtonable', 'Psc/UI/WidgetWrapper'
       ], function(t, html, main) {
  
  var setup =  function (test, ready) {
    var $dropBox1, $dropBox2, dropBox1, dropBox2, drag, $fixture;
      
    main.getEventManager().setLogging(true);
    
    $fixture = $('#visible-fixture').empty().append(html);
      
    $dropBox1 = $fixture.find('div#drop-box1 div.psc-cms-ui-drop-box');
    $dropBox2 = $fixture.find('div#drop-box2 div.psc-cms-ui-drop-box');
    
    console.log('read');
    dropBox1 = Psc.UI.WidgetWrapper.unwrapWidget($dropBox1, Psc.UI.DropBox);
    dropBox2 = Psc.UI.WidgetWrapper.unwrapWidget($dropBox2, Psc.UI.DropBox);

    drag = new Psc.UI.Dragger();
    
    return t.setup(test, {
      drag: drag,
      $fixture: $fixture,
      main: main,
      dropBox1: dropBox1,
      dropBox2: dropBox2,
      $dropBox1: $dropBox1,
      $dropBox2: $dropBox2
    });
  };
  
  test("fixture test: drop boxes are loaded from js, with buttons", function () {
    var that = setup(this);
    this.assertEquals(1, that.$dropBox1.length);
    this.assertEquals(1, that.$dropBox2.length);
    
    this.assertInstanceOf(Psc.UI.DropBox, that.dropBox1, 'that.dropBox1 is a UI that.dropBox');
    this.assertInstanceOf(Psc.UI.DropBox, that.dropBox2, 'that.dropBox2 is a UI that.dropBox');
    
    this.assertEquals(1, ($button1 = that.$dropBox1.find('button.psc-cms-ui-button')).length, 'button is in that.dropBox1');
    this.assertEquals(1, ($button2 = that.$dropBox2.find('button.psc-cms-ui-button')).length, 'button is in that.dropBox2');

    this.assertTrue(that.dropBox1.hasButton($button1),'db1 has button1');
    this.assertTrue(that.dropBox2.hasButton($button2), 'db2 has button2');
    
    // connected hier über Kreuz connecten geht nicht (witziger weise)
    this.assertEquals('div.psc-cms-ui-drop-box', that.dropBox1.unwrap().sortable('option', 'connectWith'), 'that.dropBox1 is connected to all');
    this.assertEquals('div.psc-cms-ui-drop-box', that.dropBox2.isConnectedWith(), 'that.dropBox1 is connected to all');
  });
  
  test("sorting from box1 to box2 changes DOM", function () {
    var that = setup(this);
    $button2 = that.$dropBox2.find('button.psc-cms-ui-button');
    
    drag.toElement($button2, that.$dropBox1);
    
    this.assertTrue(that.dropBox1.hasButton($button2), 'that.dropBox1 has received button2');
    this.assertEquals(2, that.$dropBox1.find('button.psc-cms-ui-button').length, 'has now 2 buttons');
    this.assertFalse(that.dropBox2.hasButton($button2), 'that.dropBox2 has given button2 away');
    this.assertEquals(0, that.$dropBox2.find('button.psc-cms-ui-button').length, 'has now 0 buttons');
  });
  
  test("after sorting new buttons can be deleted", function () {
    var that = setup(this);
    $button2 = that.$dropBox2.find('button.psc-cms-ui-button');
    $button1 = that.$dropBox1.find('button.psc-cms-ui-button');
    
    drag.toElement($button2, that.$dropBox1);
    this.assertTrue(that.dropBox1.hasButton($button2),'that.dropBox1 has received button2');
    
    // entfernt beide aus der box
    that.dropBox1.removeButton($button1);
    $button2.simulate('click');
    
    this.assertEquals(0, that.$dropBox1.find('button').length, 'kein button mehr da');
    this.assertFalse(that.dropBox1.hasButton($button2), 'button2 can be removed');
  });
  
  
  test("after sorting new buttons can be deleted", function () {
    var that = setup(this);
    $button2 = that.$dropBox2.find('button.psc-cms-ui-button');
    
    drag.toElement($button2, that.$dropBox1);
  });
});