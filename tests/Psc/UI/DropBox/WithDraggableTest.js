define(['psc-tests-assert',
        'text!fixtures/dropbox-with-draggable.html',
        'Psc/UI/DropBox', 'Psc/UI/Dragger','Psc/UI/DropBox','Psc/UI/DropBoxButton','Psc/CMS/Item', 'Psc/CMS/TabOpenable', 'Psc/CMS/Buttonable', 'Psc/CMS/Identifyable','Psc/CMS/DropBoxButtonable', 'Psc/UI/WidgetWrapper'
       ], function(t, html) {
  
  module('Psc.UI.DropBox (withDraggable)');
  
  var setup =  function (test, ready) {
    var $dropBox1, dropBox1, $draggable, drag, $fixture, d = $.Deferred(), fastItem;

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
    $fixture = $('#qunit-fixture').empty().append(html); // nicht visible nehmen das klappt in phantom nich
    
    $.when( main.getLoader().finished() ).then(function () {
      $dropBox1 = $fixture.find('div#drop-box1 div.psc-cms-ui-drop-box');
      $draggable = $fixture.find('#draggable .psc-cms-ui-button');
      
      dropBox1 = Psc.UI.WidgetWrapper.unwrapWidget($dropBox1, Psc.UI.DropBox);
      fastItem = Psc.UI.WidgetWrapper.unwrapWidget($draggable, Psc.CMS.FastItem);
  
      drag = new Psc.UI.Dragger();

      t.setup(test, {
        drag: drag,
        $fixture: $fixture,
        main: main,
        dropBox1: dropBox1,
        $dropBox1: $dropBox1,
        draggable: fastItem,
        $draggable: $draggable
      });
    
      d.resolve(test);
    }, function (loader, errors) {
      throw errors[0];
    });
    
    return d.promise();
  };
  
  asyncTest("fixture test: drop boxes are loaded from js, with draggable", function () {
    $.when(setup(this)).then(function (that) {
      that.assertEquals(1, that.$dropBox1.length);
      
      that.assertInstanceOf(Psc.UI.DropBox, that.dropBox1, 'that.dropBox1 is a UI dropBox');
      
      var $button1;
      that.assertEquals(1, ($button1 = that.$dropBox1.find('button.psc-cms-ui-button')).length, 'button is in dropBox1');
      that.assertTrue(that.dropBox1.hasButton($button1),'db1 has button1');
      
      that.assertjQueryLength(1, that.$draggable, 'draggable is there');
  
      start();
    });
  });
  
  asyncTest("draggin the draggable to the box, add its to the box", function () {
    $.when(setup(this)).then(function (that) {
      
      that.drag.toElement(that.$draggable, that.$dropBox1);
      
      that.assertTrue(that.dropBox1.hasButton(that.draggable), 'that.dropBox1 has a widget copy from button2 recieved');
      that.assertFalse(that.dropBox1.hasButton(that.$draggable));
      that.assertjQueryLength(2, that.$dropBox1.find('button.psc-cms-ui-button'), 'has now 2 buttons');
      that.assertjQueryLength(1, that.$fixture.find('#draggable .psc-cms-ui-button'), 'draggable is still in place');
      
      start();
    });
  });
});