define(['psc-tests-assert','Psc/UI/AutoComplete','Psc/EventManagerMock','Psc/AjaxHandler','Psc/UI/Tab'], function(t) {
  var html, $html, $autoComplete;
  
  module("Psc.UI.AutoComplete", {
    setup: function () {
      html =
      '<div class="input-set-wrapper"><input type="text" style="width: 90%" id="identifier" class="text ui-widget-content ui-corner-all autocomplete sc-guid-identifier" value="" name="identifier">'+
      ''+
      '<br><small class="hint">Sound-Suche nach Volltext, Soundnummer oder #tiptoi-cms-id</small>'+
      '</div>';
    
      $html = $(html);
      $('#qunit-fixture').html($html); // nicht append sonst haben wir jeweils 2 (und mehr)
      $autoComplete = $html.find('input[name="identifier"]');
    }
  });

  var setup = function(test) {
      var html =
      '<div class="input-set-wrapper"><input type="text" style="width: 90%" id="identifier" class="text ui-widget-content ui-corner-all autocomplete sc-guid-identifier" value="" name="identifier">'+
      ''+
      '<br><small class="hint">Sound-Suche nach Volltext, Soundnummer oder #tiptoi-cms-id</small>'+
      '</div>';
    
      var $html = $(html);
      $('#qunit-fixture').html($html); // nicht append sonst haben wir jeweils 2 (und mehr)
      var $autoComplete = $html.find('input[name="identifier"]');

      return t.setup(test, {$autoComplete: $autoComplete, $html: $html, html: html, $fixture: $('#qunit-fixture')});
    }
  
  asyncTest("acceptance", function() {
    start();
    var ajaxHandlerMockClass = Class({
      isa: Psc.AjaxHandler,
      
      after: {
        handle: function (request) {
          this.assertEquals('gira', request.getBody().search, 'gira is send as request term');
          this.assertEquals('true', request.getBody().autocomplete);
        }
      }
    });
    
    var evm;
    var autoComplete = new Psc.UI.AutoComplete({
      ajaxHandler: new ajaxHandlerMockClass(),
      eventManager: evm = new Psc.EventManagerMock({denySilent:true, allow: []}),
      delay: 100,
      minLength: 1,
      url: '/js/fixtures/ajax/http.autocomplete.response.php',
      widget: $autoComplete
    });
    
    this.assertEquals(100, $autoComplete.autocomplete('option','delay'),'delay is put to widget');
    this.assertEquals(1, $autoComplete.autocomplete('option','minLength'), 'minlength is put to widget');
    
    // jetzt faken wir das "tippen" ins feld
    $autoComplete.simulate("focus")['val']( "gira" ).keydown();
    stop();

    // die jquery-ui-guys machen das hier so
    setTimeout(function() {
      start();
      
	  this.assertTrue( $autoComplete.is( ":visible" ), "menu is visible after delay" );
      //this.assertTrue(autoComplete.isOpen(), 'autoComplete isOpen() is true');
      // geht nicht verlässlich
      
      // select first
	  $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	  $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
      
      this.assertNotFalse(evm.wasTriggered('tab-open', 1, function (e, tab, $target) {
        this.assertSame($target[0], $autoComplete[0],'target from event is the autocomplete');
        this.assertInstanceOf(Psc.UI.Tab, tab, 'event Parameter eins ist ein Psc.UI.Tab');
        return true;
      }), 'tab-open was triggered');
      
    }, 400 ); // bigger than delay
  });
  
  
  test("manual searching", function() {
      var autoComplete = new Psc.UI.AutoComplete({
        //ajaxHandler: new ajaxHandlerMockClass(),
        //eventManager: evm = new Psc.EventManagerMock({denySilent:true, allow: []}),
        delay: 100,
        minLength: 1,
        url: '/js/fixtures/ajax/http.autocomplete.response.php',
        widget: $autoComplete
      });

      autoComplete.search('giraffe')
      stop();

      setTimeout(function() {
        start();
        this.assertTrue(autoComplete.isOpen(),'isOpen() is true after searching');
        
        setTimeout(function() {
          $autoComplete.blur();
        },1);
      }, 600);
  });
  
  
  var testOpenItemsNum = function (testLabel, searchTerm, assertItemsNum) {
    var ajaxHandlerMockClass = Class({
      isa: Psc.AjaxHandler,
      
      override: {
        handle: function (request) {
          fail("ajax should never be called in avaibleItems-Mode");
        }
      }
    });
    
    var autoComplete = new Psc.UI.AutoComplete({
        ajaxHandler: new ajaxHandlerMockClass(),
        //eventManager: evm = new Psc.EventManagerMock({denySilent:true, allow: []}),
        widget: $autoComplete,
        delay: 100,
        minLength: 0, // minlength muss 0 sein, denn wir wollen ja auch "leer" testen
        avaibleItems: [{"label":"Tag: Russland","value":1,"tci":{"identifier":1,"id":"entities-tag-1-form","label":"Tag: Russland","fullLabel":"Tag: Russland","drag":false,"type":"entities-tag","url":null}},
                       {"label":"Tag: Demonstration","value":2,"tci":{"identifier":2,"id":"entities-tag-2-form","label":"Tag: Demonstration","fullLabel":"Tag: Demonstration","drag":false,"type":"entities-tag","url":null}},
                       {"label":"Tag: Protest","value":4,"tci":{"identifier":4,"id":"entities-tag-4-form","label":"Tag: Protest","fullLabel":"Tag: Protest","drag":false,"type":"entities-tag","url":null}},
                       {"label":"Tag: Wahl","value":5,"tci":{"identifier":5,"id":"entities-tag-5-form","label":"Tag: Wahl","fullLabel":"Tag: Wahl","drag":false,"type":"entities-tag","url":null}},
                       {"label":"Tag: Präsidentenwahl","value":10,"tci":{"identifier":10,"id":"entities-tag-10-form","label":"Tag: Präsidentenwahl","fullLabel":"Tag: Pr\u00e4sidentenwahl","drag":false,"type":"entities-tag","url":null}}]
    });
    
    
      var eventTriggered = false;
      autoComplete.getEventManager().on('auto-complete-open', function (e, items) {
        eventTriggered = true;
        this.assertEquals(assertItemsNum, items.length, 'es werden '+assertItemsNum+' items für "'+searchTerm+'" angezeigt');
      });

      // trigger
      autoComplete.search(searchTerm);
      stop();

      setTimeout(function() {
        start();
        this.assertTrue(autoComplete.isOpen(),'isOpen() is true after searching '+testLabel);
        this.assertTrue(eventTriggered,'event has triggered before opening (time) '+testLabel);
      
        setTimeout(function() {
          $autoComplete.blur();
        },1);
      }, 110);
  };


  test("autocomplete ohne ajax Suche Tag:", function () {
    testOpenItemsNum('test #1', "Tag:", 5);    
  });
  
  test("autocomplete ohne ajax leere Suche", function () {
    testOpenItemsNum('test #2', "", 5);
  });
  
  test("autocomplete ohne ajax suche Prot", function () {
    testOpenItemsNum('test #3', "Prot", 1);
  });
    
  test("autocomplete ohne ajax suche Wahl", function () {
    testOpenItemsNum('test #4', "Wahl", 2);
  });

  test("notfound is triggered", function () {
    expect(1);
    
    var autoComplete = new Psc.UI.AutoComplete({
        widget: $autoComplete,
        delay: 100,
        minLength: 0, // minlength muss 0 sein, denn wir wollen ja auch "leer" testen
        avaibleItems: [{"label":"Tag: Russland","value":1,"tci":{"identifier":1,"id":"entities-tag-1-form","label":"Tag: Russland","fullLabel":"Tag: Russland","drag":false,"type":"entities-tag","url":null}},
                       {"label":"Tag: Demonstration","value":2,"tci":{"identifier":2,"id":"entities-tag-2-form","label":"Tag: Demonstration","fullLabel":"Tag: Demonstration","drag":false,"type":"entities-tag","url":null}},
                       {"label":"Tag: Protest","value":4,"tci":{"identifier":4,"id":"entities-tag-4-form","label":"Tag: Protest","fullLabel":"Tag: Protest","drag":false,"type":"entities-tag","url":null}},
                       {"label":"Tag: Wahl","value":5,"tci":{"identifier":5,"id":"entities-tag-5-form","label":"Tag: Wahl","fullLabel":"Tag: Wahl","drag":false,"type":"entities-tag","url":null}},
                       {"label":"Tag: Präsidentenwahl","value":10,"tci":{"identifier":10,"id":"entities-tag-10-form","label":"Tag: Präsidentenwahl","fullLabel":"Tag: Pr\u00e4sidentenwahl","drag":false,"type":"entities-tag","url":null}}]
    });
    
    autoComplete.getEventManager().on('auto-complete-notfound', function (e) {
      this.assertTrue(true, "notfound is triggered");
    });
    
    autoComplete.search("nix ist da");

  });
  
  asyncTest("AutoComplete Restraints Query to maxResults if Set", function () {
    setup(this);
    
    var request;
    var autoComplete = new Psc.UI.AutoComplete({
      ajaxHandler: new (Class({
        isa: Psc.AjaxHandler,
      
        after: {
          handle: function (req) {
            console.log(req);
            var body = req.getBody();
            start();
            
            this.assertEquals(15, body.maxResults, 'maxResult is set in Request Body');
          }
        }
      }))(),
      
      //eventManager: evm = new Psc.EventManagerMock({denySilent:true, allow: []}),
      delay: 100,
      minLength: 1,
      maxResults: 15,
      url: '/js/fixtures/ajax/http.autocomplete.response.php',
      widget: this.$autoComplete
    });
    
    autoComplete.search("a"); // makes normaly a big result
  });
  
  asyncTest("AutoComplete shows maxresult info hint when maxResults are given in meta in acInfo", function () {
    fail('todo');
    start();
  });
});