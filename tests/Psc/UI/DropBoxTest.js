define(['Psc/UI/DropBox','Psc/UI/DropBoxButton','Psc/CMS/Item', 'Psc/CMS/TabOpenable', 'Psc/CMS/Buttonable', 'Psc/CMS/Identifyable','Psc/CMS/DropBoxButtonable'], function() {

  var loadFixture = function(assertions) {
    return function () {
      $.get('/js/fixtures/dropbox.php', function (html) {
        //var $fixture = $('#qunit-fixture').html(html);
        var $fixture = $('#visible-fixture').html(html);
        var $dropBox = $fixture.find('.psc-cms-ui-drop-box');
        assertEquals($dropBox.length,1,'self-test: Fixture hat div.psc-cms-ui-drop-box im html des Ajax Requests');
        
        assertions($dropBox);
      }, 'html');
    };
  };
  
  var setupDefault = function(testBody) {
    return loadFixture(function ($dropBox) {
      var dropBox = new Psc.UI.DropBox({
        widget: $dropBox,
        name: 'tags'
      });
      
      testBody(dropBox, $dropBox);
    });
  };
  
  var setupHTMLButtons = function (testBody) {
    return loadFixture(function ($dropBox) {
      
      // erstelle einen assigned button und füge ihn hinzu
      var $button = $('<button class="psc-cms-ui-button psc-guid-4fbf432195ba0 assigned-item">Button 10</button>');
      $dropBox.append($button);
  
      new Psc.CMS.Item({ // linked sich selbst an $button
        traits: [Psc.CMS.DropBoxButtonable],
        tab: {"id":"test-button-10-form","label":"Button 10 Tab","url":"egal"},
        button: {"label":"Button 10","fullLabel":"Button 10","mode":2},
        identifier: 10,
        entityName: "default-button",
        widget: $button
      });
      
      $button.button({});
      
      var dropBox = new Psc.UI.DropBox({
        widget: $dropBox,
        name: 'tags'
      });

      testBody(dropBox, $dropBox, $button);
    });
  };
  
  var defaultButton = Class({
    does: Psc.UI.DropBoxButton,
    
    has: {
      id: { is: 'rw', required: true, isPrivate: false },
      label: { is: 'rw', required: false, isPrivate: false }
    },
    
    after: {
      initialize: function (props) {
        this.setLabel('Button '+this.getId());
      }
    },

    methods: {
      getHash: function () {
        return 'default-button-'+this.getId();
      },
      
      serialize: function () {
        return this.getId();
      },
      getHTMLCopy: function () {
        return $('<button></button>').button({label: this.getLabel()});
      }
    }
  });
  
  var defaultButtons = [];
  var button2, button3, button4;
  module("Psc.UI.DropBox", {
    setup: function () {
      defaultButtons.push(button2 = new defaultButton({id: 2}));
      defaultButtons.push(button3 = new defaultButton({id: 3}));
      defaultButtons.push(button4 = new defaultButton({id: 4}));
    }
  });

  asyncTest("acceptance", setupDefault(function(dropBox, $dropBox) {
    start();
    assertSame(dropBox, $dropBox.data('joose'),'joose is linked to $dropBox');
    
    $dropBox.hasClass('ui-widget-content ui-corner-all');
    
    dropBox.addButton(button2);
    dropBox.addButton(button3);
    dropBox.addButton(button4);
  }));

  asyncTest("adds a button", setupDefault(function(dropBox, $dropBox) {
    start();
    assertEquals(0, $dropBox.find('button.psc-cms-ui-button').length, 'dropbox is empty before');
    
    dropBox.addButton(button2);
    
    var $button2 = $dropBox.find('button.psc-cms-ui-button');
    assertEquals(1, $button2.length, 'dropbox has 1 button with psc-cms-ui-button class in it');
    
    assertEquals('Button 2',$button2.text(), 'Button in Dropbox shows the correct label');
    assertTrue($button2.hasClass('assigned-item'),' Button has the class assigned-item ');
  }));
  
  asyncTest("removes an added button", setupDefault(function(dropBox, $dropBox) {
    var $button3;
    
    start();
    assertEquals(0, $dropBox.find('button.psc-cms-ui-button').length, 'dropbox is empty before');
    
    dropBox.addButton(button3);
    $button3 = $dropBox.find('button.psc-cms-ui-button');
    assertEquals(1, $dropBox.find('button.psc-cms-ui-button').length, 'dropbox has 1 button');
    
    dropBox.removeButton($button3);
    
    assertEquals(0, $dropBox.find('button.psc-cms-ui-button').length, 'dropbox is empty after');
  }));
  
  asyncTest("removes button on click", setupDefault(function(dropBox, $dropBox) {
    start();
    
    dropBox.addButton(button4);
    $button4 = $dropBox.find('button.psc-cms-ui-button');
    
    $button4.simulate('click');
    
    assertEquals(0, $dropBox.find('button.psc-cms-ui-button').length, 'button is removed');
  }));

  asyncTest("serializes all added buttons", setupDefault(function(dropBox, $dropBox) {
    start();
    
    dropBox.setName('buttons');
    
    dropBox.addButton(button2);
    dropBox.addButton(button3);
    dropBox.addButton(button4);
    
    var data = {};
    dropBox.serialize(data);

    assertEquals({'buttons': [2,3,4]}, data);
    
  }));

  // das könnte ein schönerer unit test sein für den nächsten serializes test
  asyncTest("has button from html without adding", setupHTMLButtons(function(dropBox, $dropBox, $button) {
    assertTrue(dropBox.hasButton($button), 'drop box has the button from html');
    start();
  }));

  asyncTest("serializes all added and from html buttons", setupHTMLButtons(function(dropBox, $dropBox) {
    start();
    
    dropBox.setName('buttons');
    dropBox.addButton(button2);
    
    var data = {};
    dropBox.serialize(data);

    assertEquals({'buttons': [10,2]}, data); // nummer 10 ist aus dem html
  }));


  asyncTest("triggers drop-box-multiple-violated on second button when multiple is false", setupDefault(function(dropBox, $dropBox) {
    assertFalse(dropBox.isMultiple(), 'dropbox is multiple');
    
    dropBox.addButton(button2);
    
    var multipleTriggered = false;
    dropBox.getEventManager().off('drop-box-multiple-violated'); // kein alert im test
    dropBox.getEventManager().on('drop-box-multiple-violated', function (e, vioButton) {
      e.preventDefault();
      e.stopImmediatePropagation();
      assertSame(button2, vioButton, 'violated button equals addded button2');
      multipleTriggered = true;
    });
    
    dropBox.addButton(button2);
    
    assertTrue(multipleTriggered, 'multiple was triggered after adding the same button twice');
    start();
  }));
  
  asyncTest("can be enabled and disabled", setupDefault(function(dropBox, $dropBox) {
    start();
    fail("todo");
  }));

  asyncTest("items can be sortable", setupDefault(function(dropBox, $dropBox) {
    start();
    assertNotUndefined($dropBox.data('sortable'));
  }));


  asyncTest("has button after adding", setupDefault(function(dropBox, $dropBox) {
    dropBox.addButton(button3);
    
    assertTrue(dropBox.hasButton(button3), 'has button 3 as Joose Object');
    
    $button3 = dropBox.unwrap().find('button.psc-cms-ui-button');
    assertTrue(dropBox.hasButton($button3), 'has button 3 as jquery');
    start();
  }));
  
  asyncTest("cann be connected with other drop boxes", setupDefault(function(dropBox, $dropBox) {
    fail('todo');
    start();
  }));

  asyncTest("when sorted in connectedWith, hashes button (has) on sortable stop", setupDefault(function(dropBox, $dropBox) {
    fail('todo');
    start();
  }));

});