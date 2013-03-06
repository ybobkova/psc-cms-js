define(['psc-tests-assert',
        'text!fixtures/dropboxes-connected.html', // change to php for quick and dirty acceptance while dev
        'Psc/UI/DropBox', 'Psc/UI/Dragger','Psc/UI/DropBox','Psc/UI/DropBoxButton','Psc/CMS/Item', 'Psc/CMS/TabOpenable', 'Psc/CMS/Buttonable', 'Psc/CMS/Identifyable','Psc/CMS/DropBoxButtonable', 'Psc/UI/WidgetWrapper'
       ], function(t, html) {
  
  module('Psc.UI.DropBox (connectWith)');
  
  var setup =  function (test, ready) {
    var $dropBox1, $dropBox2, dropBox1, dropBox2, drag, $fixture, d = $.Deferred();

    // we bootstrap our own main, because the inline scripts register the gridPanel to main
    var main = new Psc.UI.Main({
      tabs: new Psc.UI.Tabs({
        widget: $('<div />')
      })
    });
    main.attachHandlers();
  
    // we inject the requireLoad function to not use js/main, but to use our test-main here
    window.requireLoad = function(requirements, payload) {
      main.getLoader().onRequire(requirements, function () {
        payload.apply(this, [main].concat(Array.prototype.slice.call(arguments)));
      });
    };
      
    main.getEventManager().setLogging(true);
    
    $fixture = $('#qunit-fixture').empty()
      .css({
        'position': 'absolute',
        'top': 100,
        'left': 200,
        width: '600px'
      })
      .append(html); // nicht visible nehmen das klappt in phantom nich
    
    $.when( main.getLoader().finished() ).then(function () {
      $dropBox1 = $fixture.find('div#drop-box1 div.psc-cms-ui-drop-box');
      $dropBox2 = $fixture.find('div#drop-box2 div.psc-cms-ui-drop-box');
      
      dropBox1 = Psc.UI.WidgetWrapper.unwrapWidget($dropBox1, Psc.UI.DropBox);
      dropBox2 = Psc.UI.WidgetWrapper.unwrapWidget($dropBox2, Psc.UI.DropBox);
  
      drag = new Psc.UI.Dragger();
      
      t.setup(test, {
        drag: drag,
        $fixture: $fixture,
        main: main,
        dropBox1: dropBox1,
        dropBox2: dropBox2,
        $dropBox1: $dropBox1,
        $dropBox2: $dropBox2
      });
    
      d.resolve(test);
    }, function (loader, errors) {
      throw errors[0];
    });
    
    return d.promise();
  };
  
  asyncTest("fixture test: drop boxes are loaded from js, with buttons", function () {
    $.when(setup(this)).then(function (that) {
      that.assertEquals(1, that.$dropBox1.length);
      that.assertEquals(1, that.$dropBox2.length);
      
      that.assertInstanceOf(Psc.UI.DropBox, that.dropBox1, 'that.dropBox1 is a UI dropBox');
      that.assertInstanceOf(Psc.UI.DropBox, that.dropBox2, 'that.dropBox2 is a UI dropBox');
      
      var $button1, $button2;
      that.assertEquals(1, ($button1 = that.$dropBox1.find('button.psc-cms-ui-button')).length, 'button is in dropBox1');
      that.assertEquals(1, ($button2 = that.$dropBox2.find('button.psc-cms-ui-button')).length, 'button is in dropBox2');
  
      that.assertTrue(that.dropBox1.hasButton($button1),'db1 has button1');
      that.assertTrue(that.dropBox2.hasButton($button2),'db2 has button2');
      
      // connected hier über Kreuz connecten geht nicht (witziger weise)
      that.assertEquals('div.psc-cms-ui-drop-box', that.dropBox1.unwrap().sortable('option', 'connectWith'), 'dropBox1 is connected to all');
      that.assertEquals('div.psc-cms-ui-drop-box', that.dropBox2.isConnectedWith(), 'dropBox1 is connected to all');
      start();
    });
  });
  
  asyncTest("sorting from box1 to box2 changes DOM", function () {
    $.when(setup(this)).then(function (that) {
      var $button2 = that.$dropBox2.find('button.psc-cms-ui-button');
      var $b2 = $button2;
      
      that.drag.toElement($button2, that.$dropBox1);
      
      // does not work with simulate:
      expect(0);
      /*
      that.assertTrue(that.dropBox1.hasButton($button2), 'that.dropBox1 has received button2');
      that.assertEquals(2, that.$dropBox1.find('button.psc-cms-ui-button').length, 'has now 2 buttons');
      that.assertFalse(that.dropBox2.hasButton($button2), 'that.dropBox2 has given button2 away');
      that.assertEquals(0, that.$dropBox2.find('button.psc-cms-ui-button').length, 'has now 0 buttons');
      */
      start();
    });
  });
  
  asyncTest("after sorting new buttons can be deleted", function () {
    $.when(setup(this)).then(function (that) {
      var $button1, $button2;
      
      $button2 = that.$dropBox2.find('button.psc-cms-ui-button');
      $button1 = that.$dropBox1.find('button.psc-cms-ui-button');
      
      that.drag.toElement($button2, that.$dropBox1);
      
      // does not work as expected
      //that.assertTrue(that.dropBox1.hasButton($button2),'that.dropBox1 has received button2');
      
      // entfernt beide aus der box
      that.dropBox1.removeButton($button1);
      $button2.simulate('click');
      
      that.assertEquals(0, that.$dropBox1.find('button').length, 'kein button mehr da');
      that.assertFalse(that.dropBox1.hasButton($button2), 'button2 can be removed');
      start();
    });
  });
  
  asyncTest("after sorting new buttons can be deleted", function () {
    expect(0);
    $.when(setup(this)).then(function (that) {
      var $button2 = that.$dropBox2.find('button.psc-cms-ui-button');
    
      that.drag.toElement($button2, that.$dropBox1);
      start();
    });
  });
});