define(['psc-tests-assert','text!fixtures/combobox.html', 'jquery-simulate', 'Psc/UI/ComboBox', 'Psc/UI/AutoComplete'], function(t, html) {

  var setup = function(test, items) {
    var $fixture = $('#qunit-fixture').html(html);
    var $comboBox = $fixture.find('.psc-cms-ui-combo-box');

    var initialText = "Begriff hier eingeben, um die Auswahl einzuschränken.";
    var autoComplete;
    
    if (items) {
      autoComplete = new Psc.UI.AutoComplete({
          // kopiert aus dem comboBox2Test.php
          avaibleItems: [{"label":"Tag: Russland","value":1,"tci":{"identifier":1,"id":"entities-tag-1-form","label":"Tag: Russland","fullLabel":"Tag: Russland","drag":false,"type":"entities-tag","url":null}},{"label":"Tag: Demonstration","value":2,"tci":{"identifier":2,"id":"entities-tag-2-form","label":"Tag: Demonstration","fullLabel":"Tag: Demonstration","drag":false,"type":"entities-tag","url":null}},{"label":"Tag: Protest","value":4,"tci":{"identifier":4,"id":"entities-tag-4-form","label":"Tag: Protest","fullLabel":"Tag: Protest","drag":false,"type":"entities-tag","url":null}},{"label":"Tag: Wahl","value":5,"tci":{"identifier":5,"id":"entities-tag-5-form","label":"Tag: Wahl","fullLabel":"Tag: Wahl","drag":false,"type":"entities-tag","url":null}},{"label":"Tag: Pr\u00e4sidentenwahl","value":10,"tci":{"identifier":10,"id":"entities-tag-10-form","label":"Tag: Pr\u00e4sidentenwahl","fullLabel":"Tag: Pr\u00e4sidentenwahl","drag":false,"type":"entities-tag","url":null}}],
          widget: $comboBox
      });
    } else {
      autoComplete = new Psc.UI.AutoComplete({
          widget: $comboBox,
          delay: 100,
          url: '/tests/files/autocomplete.json' // requirejs to url?
      });
    }

    var comboBox = new Psc.UI.ComboBox({
        widget: $comboBox,
        name: 'tags',
        selectMode: true,
        initialText: initialText,
        autoComplete: autoComplete
    });
    
    return t.setup(test, { $fixture: $fixture, $comboBox: $comboBox, comboBox: comboBox, initialText: initialText });
  };
  
  module("Psc.UI.ComboBox");

  test("serialize sets value from item", function () {
    var that = setup(this), comboBox = this.comboBox, $comboBox = this.$comboBox, initialText = this.initialText;
    comboBox.setSelectMode(true);
    comboBox.setSelected({ label: 'blubb', value: 17});
    
    var data = {};
    comboBox.serialize(data);
    
    this.assertEquals({
      'tags': 17 // name aus dem fixture
    }, data, 'data is set');
  });
  
  test("serialize sets empty value when initialtext is shown", function () {
    var that = setup(this), comboBox = this.comboBox, $comboBox = this.$comboBox, initialText = this.initialText;
    this.assertEquals(true, comboBox.getSelectMode());
    
    var data = {};
    comboBox.serialize(data);
    
    this.assertEquals({
      'tags': '' // name aus dem fixture
    }, data, 'data is set to empty');
  });
  
  test("serialize does not override value in data when selectMode is true", function () {
    var that = setup(this), comboBox = this.comboBox, $comboBox = this.$comboBox, initialText = this.initialText;
    
    comboBox.setSelectMode(false);
    comboBox.setSelected({ label: 'blubb', value: 17});
    
    var data = {tags: 'myValue'};
    comboBox.serialize(data);
    
    this.assertEquals('myValue', data.tags);
  });
  
  
  asyncTest("combo-Box triggers combo-box-select and combo-box-selected when item is selected", function() {
    expect(3);
    
    var that = setup(this), comboBox = this.comboBox, $comboBox = this.$comboBox, initialText = this.initialText;
    var autoComplete = comboBox.getAutoComplete(), $autoComplete = autoComplete.unwrap();
    
    // select is triggered
    comboBox.getEventManager().on('combo-box-select', function(e, item) {
      that.assertNotUndefined(item, "item is set in select-handler"); //(3)
    });
    
    comboBox.getEventManager().on('combo-box-selected', function(e, item) {
      that.assertSame(item, comboBox.getSelected(), 'item is set in select-handler'); //(2)
    });

    autoComplete.getEventManager().on('auto-complete-open', function () {
      that.assertTrue(autoComplete.isOpen(), 'autoComplete isOpen() is true'); //(1)
      
      // select second
      $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
      //$autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
      $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
      
      start();
    });
    
    $autoComplete.simulate("focus").val("gira").keydown();
  });
  
  asyncTest("acceptance with items", function() {
    expect(2);
    
    var that = setup(this, true), comboBox = this.comboBox, $comboBox = this.$comboBox, initialText = this.initialText;
    var autoComplete = comboBox.getAutoComplete();
    
    var $button = $comboBox.next('button.ui-button');
    that.assertEquals(1, $button.length, 'button is found next to $comboBox');
    
    autoComplete.getEventManager().on('auto-complete-open', function (e, items) {
      that.assertEquals(5, items.length, 'all items are shown in box');
      start();
    });

    $button.simulate('click');
  });

  asyncTest("acceptance with items bad autocomplete word", function() {
    expect(1);
    
    var that = setup(this, true), comboBox = this.comboBox, $comboBox = this.$comboBox, initialText = this.initialText;
    var autoComplete = comboBox.getAutoComplete(), $autoComplete = autoComplete.unwrap();
    
    comboBox.getEventManager().on('auto-complete-open', function (e, items) {
      start();
      that.fail("nothing should be found - so open should not be triggered");
    });

    comboBox.getEventManager().on('auto-complete-notfound', function (e, search) {
      start();
      that.assertEquals('notintags', search, 'search term is given in event');
    });

    $autoComplete.simulate("focus").val("notintags").keydown(); // simulate ist immer asynchron (anders als simulate click: hä?!)
  });
  
  asyncTest("acceptance in select mode", function() {
    expect(3);
    
    var that = setup(this, true), comboBox = this.comboBox, $comboBox = this.$comboBox, initialText = this.initialText;
    var autoComplete = comboBox.getAutoComplete(), $autoComplete = autoComplete.unwrap();
    comboBox.setSelectMode(true);

    comboBox.getEventManager().on('combo-box-selected', function(e, item) {
      that.assertTrue(true, 'was selected');
    });
    
    var $button = $comboBox.next('button.ui-button');

    autoComplete.getEventManager().on('auto-complete-open', function () {
      that.assertTrue(autoComplete.isOpen(), 'autoComplete isOpen() is true'); //(1)
      
      // select second
      $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
      $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
      
      that.assertEquals('Tag: Protest', $autoComplete.val(), 'Protest Tag is in val() of input');
      start();
    });

    $autoComplete.simulate("focus").val("Prot").keydown();
  });
  
  test("TODO: set correct initial value when selected is set", function () {
    expect(0);
  });
  
  //asyncTest("acceptance from acceptance-php-test", function () {
  //  expect(0);
  //  var $html = '<div class="input-set-wrapper"><label for="psc-cms-000000000912b1810000000041e7eb66" class="psc-cms-ui-label">Account</label><input type="text" name="account" class="psc-cms-ui-combo-box psc-guid-4fb120065033f" id="psc-cms-000000000912b1810000000041e7eb66" /><script type="text/javascript">';
  //  
  //  $('#visible-fixture').html($html);
  //
  //  var j = new Psc.UI.ComboBox({
  //    widget: jQuery('input.psc-guid-4fb120065033f'),
  //    initialText: "Begriff hier eingeben, um die Auswahl einzuschr\u00e4nken.",
  //    selectMode: true,
  //    autoComplete:     new Psc.UI.AutoComplete({
  //      avaibleItems: [],
  //      widget: jQuery('input.psc-guid-4fb120065033f')
  //    })
  //  });
  //  
  //  j.unwrap().simulate("focus")['val']("Prot").keydown();
  //  start();
  //});
  
  test("TODO: combobox does not show initialtext when item from list is selected", function () {
    expect(0);
    var that = setup(this), comboBox = this.comboBox, $comboBox = this.$comboBox, initialText = this.initialText;
    // 1. box aufmachen
    // a) initial text verschwindet
    // 2. über einen eintrag hovern
    // 3. über den 2. eintrag hovern => initial text kommt wieder. moep :)
  });


  asyncTest("acceptance", function() {
    var that = setup(this), comboBox = this.comboBox, $comboBox = this.$comboBox, initialText = this.initialText;
    var autoComplete = comboBox.getAutoComplete();
    
    // initialtext will be set
    this.assertEquals(initialText, $comboBox.val(), 'init sets value in input');
    this.assertTrue($comboBox.hasClass('ui-state-disabled'),'hasClass ui-state-disabled');
    this.assertTrue($comboBox.hasClass('ui-widget'),'hasClass ui-widget');
    this.assertTrue($comboBox.hasClass('ui-widget-content'),'hasClass ui-widget-content');
    this.assertTrue($comboBox.hasClass('ui-corner-left'), 'hasClass ui-corner-left');

    // focus removes initial text
    $comboBox.simulate('focus');
    this.assertEquals('', $comboBox.val());
    
    // removes disabled
    this.assertFalse($comboBox.hasClass('ui-state-disabled'),'hasNotClass ui-state-disabled');
    
    // button gets added
    var $button = $comboBox.next('button.ui-button');
    this.assertEquals(1, $button.length, 'button is found next to $comboBox');
    
    // click on the button opens the menu after the delay (everytime)
    $button.simulate('click');
    
    setTimeout(function () {
      that.assertTrue(autoComplete.isOpen(), 'menu is open on first click');
      
      // clicking again, hides it (not yet)
      //stop();
      //setTimeout(function () {
      //  start();
      //  $button.simulate('click');
      //  this.assertFalse(autoComplete.isOpen(), 'menu is closed on second click');
      //}, 20);
      
      start();
    }, 200); // keine lust den ajax zu mocken
  });
});