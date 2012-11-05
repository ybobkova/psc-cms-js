define(['psc-tests-assert','Psc/UI/ComboBox','Psc/UI/AutoComplete'], function(t) {

  var loadFixture = function(assertions) {
    return function () {
      $.get('/js/fixtures/combobox.php', function (html) {
        var $fixture = $('#qunit-fixture').html(html);
        //var $fixture = $('#visible-fixture').html(html);
        var $comboBox = $fixture.find('.psc-cms-ui-combo-box');
        this.assertEquals($comboBox.length,1,'self-test: Fixture hat div.psc-cms-ui-combo-box im html des Ajax Requests');
        
        this.assertions($comboBox);
      }, 'html');
    };
  };
  
  var setupDefault = function(testBody) {
    
    return loadFixture(function ($comboBox) {
      var initialText = "Begriff hier eingeben, um die Auswahl einzuschränken.";
      var comboBox = new Psc.UI.ComboBox({
        widget: $comboBox,
        name: 'tags',
        selectMode: true,
        initialText: initialText,
        autoComplete: new Psc.UI.AutoComplete({
          widget: $comboBox,
          delay: 100,
          url: '/js/fixtures/ajax/http.autocomplete.response.php'
        })
      });
      
      testBody(comboBox, $comboBox, initialText);
    });
  };
  
  var setupItems = function(testBody) {
    return loadFixture(function ($comboBox) {
      var initialText = "Begriff hier eingeben, um die Auswahl einzuschränken.";
      var comboBox = new Psc.UI.ComboBox({
        widget: $comboBox,
        name: 'tags',
        selectMode: true,
        initialText: initialText,
        autoComplete: new Psc.UI.AutoComplete({
          // kopiert aus dem comboBox2Test.php
          avaibleItems: [{"label":"Tag: Russland","value":1,"tci":{"identifier":1,"id":"entities-tag-1-form","label":"Tag: Russland","fullLabel":"Tag: Russland","drag":false,"type":"entities-tag","url":null}},{"label":"Tag: Demonstration","value":2,"tci":{"identifier":2,"id":"entities-tag-2-form","label":"Tag: Demonstration","fullLabel":"Tag: Demonstration","drag":false,"type":"entities-tag","url":null}},{"label":"Tag: Protest","value":4,"tci":{"identifier":4,"id":"entities-tag-4-form","label":"Tag: Protest","fullLabel":"Tag: Protest","drag":false,"type":"entities-tag","url":null}},{"label":"Tag: Wahl","value":5,"tci":{"identifier":5,"id":"entities-tag-5-form","label":"Tag: Wahl","fullLabel":"Tag: Wahl","drag":false,"type":"entities-tag","url":null}},{"label":"Tag: Pr\u00e4sidentenwahl","value":10,"tci":{"identifier":10,"id":"entities-tag-10-form","label":"Tag: Pr\u00e4sidentenwahl","fullLabel":"Tag: Pr\u00e4sidentenwahl","drag":false,"type":"entities-tag","url":null}}],
          widget: $comboBox
        })
      });
      
      testBody(comboBox, $comboBox, initialText);
    });
  };
  
  module("Psc.UI.ComboBox");

  asyncTest("serialize sets value from item", setupDefault(function (comboBox, $comboBox, initialText) {
    start();
    comboBox.setSelectMode(true);
    comboBox.setSelected({ label: 'blubb', value: 17});
    
    var data = {};
    comboBox.serialize(data);
    
    this.assertEquals({
      'tags': 17 // name aus dem fixture
    }, data, 'data is set');
  }));
  
  asyncTest("serialize sets empty value when initialtext is shown", setupDefault(function (comboBox, $comboBox, initialText) {
    start();
    this.assertEquals(true, comboBox.getSelectMode());
    
    var data = {};
    comboBox.serialize(data);
    
    this.assertEquals({
      'tags': '' // name aus dem fixture
    }, data, 'data is set to empty');
  }));
  
  asyncTest("serialize does not override value in data when selectMode is true", setupDefault(function (comboBox, $comboBox, initialText) {
    start();
    comboBox.setSelectMode(false);
    comboBox.setSelected({ label: 'blubb', value: 17});
    
    var data = {tags: 'myValue'};
    comboBox.serialize(data);
    
    this.assertEquals('myValue', data.tags);
  }));
  
  
  asyncTest("combo-Box triggers combo-box-select and combo-box-selected when item is selected", setupDefault(function (comboBox, $comboBox) {
    start();
    
    expect(4); // +1 wegen loadFixture
    var autoComplete = comboBox.getAutoComplete(), $autoComplete = autoComplete.unwrap();
    
    $autoComplete.simulate("focus").val("gira").keydown();
    stop(); // stop for -open

    // select is triggered
    comboBox.getEventManager().on('combo-box-select', function(e, item) {
      this.assertNotUndefined(item, "item is set in select-handler"); //(3)
    });
    
    comboBox.getEventManager().on('combo-box-selected', function(e, item) {
      this.assertSame(item, comboBox.getSelected(), 'item is set in select-handler'); //(2)
    });

    autoComplete.getEventManager().on('auto-complete-open', function () {
      start();
      this.assertTrue(autoComplete.isOpen(), 'autoComplete isOpen() is true'); //(1)
      
      // select second
      $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
      //$autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
      $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
    });
  }));
  
  asyncTest("acceptance with items", setupItems(function (comboBox, $comboBox, initialText) {
    expect(3);
    start();
    var autoComplete = comboBox.getAutoComplete();
    
    var $button = $comboBox.next('button.ui-button');
    this.assertEquals(1, $button.length, 'button is found next to $comboBox');
    
    autoComplete.getEventManager().on('auto-complete-open', function (e, items) {
      this.assertEquals(5, items.length, 'all items are shown in box');
    });

    $button.simulate('click');
  }));

  asyncTest("acceptance with items bad autocomplete word", setupItems(function (comboBox, $comboBox, initialText) {
    start();
    
    expect(2);
    var autoComplete = comboBox.getAutoComplete(), $autoComplete = autoComplete.unwrap();
    
    comboBox.getEventManager().on('auto-complete-open', function (e, items) {
      start();
      fail("nothing should be found - so open should not be triggered");
    });

    comboBox.getEventManager().on('auto-complete-notfound', function (e, search) {
      start();
      this.assertEquals('notintags', search, 'search term is given in event');
    });

    $autoComplete.simulate("focus").val("notintags").keydown(); // simulate ist immer asynchron (anders als simulate click: hä?!)
    stop();
  }));
  
  asyncTest("acceptance in select mode", setupItems(function (comboBox, $comboBox, initialText) {
    expect(3+1);
    
    var autoComplete = comboBox.getAutoComplete(), $autoComplete = autoComplete.unwrap();
    comboBox.setSelectMode(true);

    comboBox.getEventManager().on('combo-box-selected', function(e, item) {
      this.assertTrue(true, 'was selected');
    });
    
    var $button = $comboBox.next('button.ui-button');

    autoComplete.getEventManager().on('auto-complete-open', function () {
      start();
      this.assertTrue(autoComplete.isOpen(), 'autoComplete isOpen() is true'); //(1)
      
      // select second
      $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
      $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
      
      this.assertEquals('Tag: Protest', $autoComplete.val(), 'Protest Tag is in val() of input');
    });

    $autoComplete.simulate("focus").val("Prot").keydown();
  }));
  
  asyncTest("set correct initial value when selected is set", setupDefault(function () {
    start();
    fail('todo');
  }));
  
  
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
  
  asyncTest("combobox does not show initialtext when item from list is selected", setupDefault(function (comboBox, $comboBox, initialText) {
    start();
    // 1. box aufmachen
    // a) initial text verschwindet
    // 2. über einen eintrag hovern
    // 3. über den 2. eintrag hovern => initial text kommt wieder. moep :)
    fail('todo');
  }));


  asyncTest("acceptance", setupDefault(function (comboBox, $comboBox, initialText) {
    start();
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
    stop();
    
    setTimeout(function () {
      
      this.assertTrue(autoComplete.isOpen(), 'menu is open on first click');
      
      // clicking again, hides it (not yet)
      //stop();
      //setTimeout(function () {
      //  start();
      //  $button.simulate('click');
      //  this.assertFalse(autoComplete.isOpen(), 'menu is closed on second click');
      //}, 20);
      
      start();
    }, 800); // keine lust den ajax zu mocken
  }));
});