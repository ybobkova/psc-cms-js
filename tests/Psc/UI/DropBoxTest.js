define(['psc-tests-assert', 'text!fixtures/dropbox.html', 'jquery-simulate',
        'Psc/UI/DropBox','Psc/UI/DropBoxButton','Psc/CMS/Item', 'Psc/CMS/TabOpenable', 'Psc/CMS/Buttonable', 'Psc/CMS/Identifyable','Psc/CMS/DropBoxButtonable'
       ], function(t, html) {
  
  module("Psc.UI.DropBox");

  var DefaultButton = Joose.Class({
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
  
  var setup = function(test, withButton) {
    var DefaultButtons = [];
    var button2, button3, button4;

    DefaultButtons.push(button2 = new DefaultButton({id: 2}));
    DefaultButtons.push(button3 = new DefaultButton({id: 3}));
    DefaultButtons.push(button4 = new DefaultButton({id: 4}));

    var $fixture = $('#visible-fixture').html(html);
    var $dropBox = $fixture.find('.psc-cms-ui-drop-box');
    
    var dropBox = new Psc.UI.DropBox({
      widget: $dropBox,
      name: 'tags'
    });
    
    var ret =  {
      DefaultButtons: DefaultButtons,
      button2: button2,
      button3: button3,
      button4: button4,
      $fixture: $fixture,
      $dropBox: $dropBox,
      dropBox: dropBox
    };


    if (withButton) {
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
      
      // override
      ret.dropBox = new Psc.UI.DropBox({
        widget: $dropBox,
        name: 'tags'
      });

      ret.$button = $button;
    }

    test = t.setup(test, ret);
    test.assertEquals($dropBox.length,1,'self-test: Fixture hat div.psc-cms-ui-drop-box im html des Ajax Requests');
    
    return test;
  };

  test("acceptance", function() {
    var that = setup(this, true);
    
    this.assertSame(that.dropBox, that.$dropBox.data('joose'), 'joose is linked to $dropBox');
    
    that.$dropBox.hasClass('ui-widget-content ui-corner-all');
    
    that.dropBox.addButton(that.button2);
    that.dropBox.addButton(that.button3);
    that.dropBox.addButton(that.button4);
  });

  test("adds a button", function() {
    var that = setup(this);
    this.assertEquals(0, that.$dropBox.find('button.psc-cms-ui-button').length, 'dropbox is empty before');
    
    that.dropBox.addButton(that.button2);
    
    var $button2 = that.$dropBox.find('button.psc-cms-ui-button');
    this.assertEquals(1, $button2.length, 'dropbox has 1 button with psc-cms-ui-button class in it');
    
    this.assertEquals('Button 2',$button2.text(), 'Button in Dropbox shows the correct label');
    this.assertTrue($button2.hasClass('assigned-item'),' Button has the class assigned-item ');
  });
  
  test("removes an added button", function() {
    var that = setup(this);
    var $button3;
    
    this.assertEquals(0, that.$dropBox.find('button.psc-cms-ui-button').length, 'dropbox is empty before');
    
    that.dropBox.addButton(that.button3);
    $button3 = that.$dropBox.find('button.psc-cms-ui-button');
    this.assertEquals(1, that.$dropBox.find('button.psc-cms-ui-button').length, 'dropbox has 1 button');
    
    that.dropBox.removeButton($button3);
    
    this.assertEquals(0, that.$dropBox.find('button.psc-cms-ui-button').length, 'dropbox is empty after');
  });
  
  test("removes button on click", function() {
    var that = setup(this);
    
    that.dropBox.addButton(that.button4);
    var $button4 = that.$dropBox.find('button.psc-cms-ui-button');
    $button4.simulate('click');
    
    this.assertEquals(0, that.$dropBox.find('button.psc-cms-ui-button').length, 'button is removed');
  });

  test("serializes all added buttons", function() {
    var that = setup(this);

    that.dropBox.setName('buttons');
    
    that.dropBox.addButton(that.button2);
    that.dropBox.addButton(that.button3);
    that.dropBox.addButton(that.button4);
    
    var data = {};
    that.dropBox.serialize(data);

    this.assertEquals({'buttons': [2,3,4]}, data);
  });

  // das könnte ein schönerer unit test sein für den nächsten serializes test
  test("has button from html without adding", function () {
    var that = setup(this, true);
    
    this.assertTrue(that.dropBox.hasButton(that.$button), 'drop box has the button from html');
  });

  test("serializes all added and from html buttons", function() {
    var that = setup(this, true);
    
    that.dropBox.setName('buttons');
    that.dropBox.addButton(that.button2);
    
    var data = {};
    that.dropBox.serialize(data);

    this.assertEquals({'buttons': [10,2]}, data); // nummer 10 ist aus dem html
  });


  test("triggers drop-box-multiple-violated on second button when multiple is false", function() {
    var that = setup(this);
    this.assertFalse(that.dropBox.isMultiple(), 'dropbox is multiple');
    
    that.dropBox.addButton(that.button2);
    
    var multipleTriggered = false;
    that.dropBox.getEventManager().off('drop-box-multiple-violated'); // kein alert im test
    that.dropBox.getEventManager().on('drop-box-multiple-violated', function (e, vioButton) {
      e.preventDefault();
      e.stopImmediatePropagation();
      that.assertSame(that.button2, vioButton, 'violated button equals addded that.button2');
      multipleTriggered = true;
    });
    
    that.dropBox.addButton(that.button2);
    
    this.assertTrue(multipleTriggered, 'multiple was triggered after adding the same button twice');
  });
  
  test("items are sortable", function() {
    var that = setup(this);

    this.assertNotUndefined(that.$dropBox.data('sortable'));
  });


  test("has button after adding", function() {
    var that = setup(this);

    that.dropBox.addButton(that.button3);
    this.assertTrue(that.dropBox.hasButton(that.button3), 'has button 3 as Joose Object');
    
    var $button3 = that.dropBox.unwrap().find('button.psc-cms-ui-button');
    this.assertTrue(that.dropBox.hasButton($button3), 'has button 3 as jquery');
  });
  
  test("TODO: when sorted in connectedWith, hashes button (has) on sortable stop", function() {
    var that = setup(this);
    expect(1);
  });
});