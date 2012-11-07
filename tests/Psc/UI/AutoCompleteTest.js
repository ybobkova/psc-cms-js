define(['psc-tests-assert','jquery-simulate','Psc/UI/AutoComplete','Psc/EventManagerMock','Psc/AjaxHandler','Psc/AjaxResponse','Psc/Loader','Psc/UI/Tab'], function(t) {
  var html, $html, $autoComplete;
  
  module("Psc.UI.AutoComplete");

  var setup = function(test) {
    var html =
      '<div class="input-set-wrapper"><input type="text" style="width: 90%" id="identifier" class="text ui-widget-content ui-corner-all autocomplete sc-guid-identifier" value="" name="identifier">'+
      ''+
      '<br><small class="hint">Sound-Suche nach Volltext, Soundnummer oder #tiptoi-cms-id</small>'+
      '</div>';

    var $html = $(html);
    $('#qunit-fixture').html($html); // nicht append sonst haben wir jeweils 2 (und mehr)
    var $autoComplete = $html.find('input[name="identifier"]');
    
    var ajaxHandlerMockClass = Class({
      isa: Psc.AjaxHandler,
      
      has: {
        searchTerm: { is : 'rw', required: true, isPrivate: true },
        responseBody: { is : 'rw', required: true, isPrivate: true }
      },
      
      override: {
        handle: function (request) {
          var mock = this;
          test.assertEquals(this.$$searchTerm, request.getBody().search, this.$$searchTerm+' is send as request term');
          test.assertEquals('true', request.getBody().autocomplete);
          
          var d = $.Deferred();
          
          setTimeout(function () {
            d.resolve(
              new Psc.AjaxResponse({
                code: 200,
                body: mock.$$responseBody,
                headers: [],
                loader: new Psc.Loader(),
                request: request
              })
            );
          }, 120);
          
          return d.promise();
        }        
      }
    });
    
    return t.setup(test, {
        $autoComplete: $autoComplete,
        $html: $html,
        html: html,
        $fixture: $('#qunit-fixture'),
        ajaxHandlerMockClass: ajaxHandlerMockClass
      }
    );
  };
  
  asyncTest("acceptance", function() {
    var that = setup(this), evm, $autoComplete = that.$autoComplete;
    
    var autoComplete = new Psc.UI.AutoComplete({
      ajaxHandler: new that.ajaxHandlerMockClass({
        responseBody: $.parseJSON('[{"ac":{"label":"FX: Sound Giraffe rupft Bl\u00e4tter von einem Ba\u2026 (2-TAF_0078)"},"identifier":16,"entityName":"sound","tab":{"id":"fxsound-16","label":"FX: Sound Giraffe rupft Bl\u00e4tter von einem Ba\u2026 (2-TAF_0078)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=fxsound&ajaxData%5Bidentifier%5D=16"},"label":"FX: Sound Giraffe rupft Bl\u00e4tter von einem Ba\u2026 (2-TAF_0078)","value":16},{"ac":{"label":"FX: Sound Giraffe trinkt gebeugt aus einem W\u2026 (2-TAF_0084)"},"identifier":17,"entityName":"sound","tab":{"id":"fxsound-17","label":"FX: Sound Giraffe trinkt gebeugt aus einem W\u2026 (2-TAF_0084)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=fxsound&ajaxData%5Bidentifier%5D=17"},"label":"FX: Sound Giraffe trinkt gebeugt aus einem W\u2026 (2-TAF_0084)","value":17},{"ac":{"label":"S: Giraffen sind sehr interessante Tiere. W\u2026 (2-TAF_0003)"},"identifier":151,"entityName":"sound","tab":{"id":"textsound-151","label":"S: Giraffen sind sehr interessante Tiere. W\u2026 (2-TAF_0003)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=151"},"label":"S: Giraffen sind sehr interessante Tiere. W\u2026 (2-TAF_0003)","value":151},{"ac":{"label":"S: Die Giraffe findet in den Baumkronen der\u2026 (2-TAF_0033)"},"identifier":180,"entityName":"sound","tab":{"id":"textsound-180","label":"S: Die Giraffe findet in den Baumkronen der\u2026 (2-TAF_0033)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=180"},"label":"S: Die Giraffe findet in den Baumkronen der\u2026 (2-TAF_0033)","value":180},{"ac":{"label":"S: [spricht leise, ged\u00e4mpft] Wir haben sehr\u2026 (2-TAF_0049)"},"identifier":191,"entityName":"sound","tab":{"id":"textsound-191","label":"S: [spricht leise, ged\u00e4mpft] Wir haben sehr\u2026 (2-TAF_0049)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=191"},"label":"S: [spricht leise, ged\u00e4mpft] Wir haben sehr\u2026 (2-TAF_0049)","value":191},{"ac":{"label":"S: Twiga hei\u00dft Giraffe auf Swahili. Das ist\u2026 (2-TAF_0057)"},"identifier":199,"entityName":"sound","tab":{"id":"textsound-199","label":"S: Twiga hei\u00dft Giraffe auf Swahili. Das ist\u2026 (2-TAF_0057)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=199"},"label":"S: Twiga hei\u00dft Giraffe auf Swahili. Das ist\u2026 (2-TAF_0057)","value":199},{"ac":{"label":"S: Giraffen in freier Wildbahn \u2013 wie riesig\u2026 (2-TAF_0059)"},"identifier":202,"entityName":"sound","tab":{"id":"textsound-202","label":"S: Giraffen in freier Wildbahn \u2013 wie riesig\u2026 (2-TAF_0059)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=202"},"label":"S: Giraffen in freier Wildbahn \u2013 wie riesig\u2026 (2-TAF_0059)","value":202},{"ac":{"label":"S: Es w\u00e4re praktischer f\u00fcr die Giraffe, wen\u2026 (2-TAF_0067)"},"identifier":212,"entityName":"sound","tab":{"id":"textsound-212","label":"S: Es w\u00e4re praktischer f\u00fcr die Giraffe, wen\u2026 (2-TAF_0067)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=212"},"label":"S: Es w\u00e4re praktischer f\u00fcr die Giraffe, wen\u2026 (2-TAF_0067)","value":212},{"ac":{"label":"S: Lisa kennt Giraffen aus dem Zoo und wei\u00df\u2026 (2-TAF_0068)"},"identifier":213,"entityName":"sound","tab":{"id":"textsound-213","label":"S: Lisa kennt Giraffen aus dem Zoo und wei\u00df\u2026 (2-TAF_0068)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=213"},"label":"S: Lisa kennt Giraffen aus dem Zoo und wei\u00df\u2026 (2-TAF_0068)","value":213},{"ac":{"label":"S: Obwohl die Giraffen so richtig riiiiesig\u2026 (2-TAF_0069)"},"identifier":214,"entityName":"sound","tab":{"id":"textsound-214","label":"S: Obwohl die Giraffen so richtig riiiiesig\u2026 (2-TAF_0069)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=214"},"label":"S: Obwohl die Giraffen so richtig riiiiesig\u2026 (2-TAF_0069)","value":214},{"ac":{"label":"S: Vor ungef\u00e4hr zweihundert Jahren brachten\u2026 (2-TAF_0071)"},"identifier":215,"entityName":"sound","tab":{"id":"textsound-215","label":"S: Vor ungef\u00e4hr zweihundert Jahren brachten\u2026 (2-TAF_0071)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=215"},"label":"S: Vor ungef\u00e4hr zweihundert Jahren brachten\u2026 (2-TAF_0071)","value":215},{"ac":{"label":"S: Es gibt mehrere Giraffenarten und jede A\u2026 (2-TAF_0070)"},"identifier":216,"entityName":"sound","tab":{"id":"textsound-216","label":"S: Es gibt mehrere Giraffenarten und jede A\u2026 (2-TAF_0070)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=216"},"label":"S: Es gibt mehrere Giraffenarten und jede A\u2026 (2-TAF_0070)","value":216},{"ac":{"label":"S: Giraffen fressen Bl\u00fcten und Bl\u00e4tter von \u2026 (2-TAF_0079)"},"identifier":221,"entityName":"sound","tab":{"id":"textsound-221","label":"S: Giraffen fressen Bl\u00fcten und Bl\u00e4tter von \u2026 (2-TAF_0079)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=221"},"label":"S: Giraffen fressen Bl\u00fcten und Bl\u00e4tter von \u2026 (2-TAF_0079)","value":221},{"ac":{"label":"S: Mit ihren langen Beinen und dem langen H\u2026 (2-TAF_0080)"},"identifier":222,"entityName":"sound","tab":{"id":"textsound-222","label":"S: Mit ihren langen Beinen und dem langen H\u2026 (2-TAF_0080)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=222"},"label":"S: Mit ihren langen Beinen und dem langen H\u2026 (2-TAF_0080)","value":222},{"ac":{"label":"S: Giraffen k\u00f6nnen eine Gr\u00f6\u00dfe von \u00fcber f\u00fcnf\u2026 (2-TAF_0081)"},"identifier":223,"entityName":"sound","tab":{"id":"textsound-223","label":"S: Giraffen k\u00f6nnen eine Gr\u00f6\u00dfe von \u00fcber f\u00fcnf\u2026 (2-TAF_0081)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=223"},"label":"S: Giraffen k\u00f6nnen eine Gr\u00f6\u00dfe von \u00fcber f\u00fcnf\u2026 (2-TAF_0081)","value":223},{"ac":{"label":"S: Giraffen fressen am liebsten die Bl\u00e4tter\u2026 (2-TAF_0082)"},"identifier":224,"entityName":"sound","tab":{"id":"textsound-224","label":"S: Giraffen fressen am liebsten die Bl\u00e4tter\u2026 (2-TAF_0082)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=224"},"label":"S: Giraffen fressen am liebsten die Bl\u00e4tter\u2026 (2-TAF_0082)","value":224},{"ac":{"label":"S: Giraffen ruhen sich meistens im Stehen a\u2026 (2-TAF_0083)"},"identifier":225,"entityName":"sound","tab":{"id":"textsound-225","label":"S: Giraffen ruhen sich meistens im Stehen a\u2026 (2-TAF_0083)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=225"},"label":"S: Giraffen ruhen sich meistens im Stehen a\u2026 (2-TAF_0083)","value":225},{"ac":{"label":"S: Giraffen trinken am liebsten jeden Tag, \u2026 (2-TAF_0085)"},"identifier":226,"entityName":"sound","tab":{"id":"textsound-226","label":"S: Giraffen trinken am liebsten jeden Tag, \u2026 (2-TAF_0085)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=226"},"label":"S: Giraffen trinken am liebsten jeden Tag, \u2026 (2-TAF_0085)","value":226},{"ac":{"label":"S: Giraffen haben kaum Feinde, denn sie sin\u2026 (2-TAF_0086)"},"identifier":228,"entityName":"sound","tab":{"id":"textsound-228","label":"S: Giraffen haben kaum Feinde, denn sie sin\u2026 (2-TAF_0086)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=228"},"label":"S: Giraffen haben kaum Feinde, denn sie sin\u2026 (2-TAF_0086)","value":228},{"ac":{"label":"S: Hast du vielleicht im Zoo schon einmal b\u2026 (2-TAF_0087)"},"identifier":229,"entityName":"sound","tab":{"id":"textsound-229","label":"S: Hast du vielleicht im Zoo schon einmal b\u2026 (2-TAF_0087)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=229"},"label":"S: Hast du vielleicht im Zoo schon einmal b\u2026 (2-TAF_0087)","value":229},{"ac":{"label":"S: Das Fell der Giraffe verstr\u00f6mt einen str\u2026 (2-TAF_0088)"},"identifier":230,"entityName":"sound","tab":{"id":"textsound-230","label":"S: Das Fell der Giraffe verstr\u00f6mt einen str\u2026 (2-TAF_0088)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=230"},"label":"S: Das Fell der Giraffe verstr\u00f6mt einen str\u2026 (2-TAF_0088)","value":230},{"ac":{"label":"S: Wenn eine Giraffe l\u00e4ngere Zeit von einer\u2026 (2-TAF_0091)"},"identifier":233,"entityName":"sound","tab":{"id":"textsound-233","label":"S: Wenn eine Giraffe l\u00e4ngere Zeit von einer\u2026 (2-TAF_0091)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=233"},"label":"S: Wenn eine Giraffe l\u00e4ngere Zeit von einer\u2026 (2-TAF_0091)","value":233},{"ac":{"label":"S: Zebras halten sich oft in der N\u00e4he von G\u2026 (2-TAF_0135)"},"identifier":275,"entityName":"sound","tab":{"id":"textsound-275","label":"S: Zebras halten sich oft in der N\u00e4he von G\u2026 (2-TAF_0135)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=275"},"label":"S: Zebras halten sich oft in der N\u00e4he von G\u2026 (2-TAF_0135)","value":275},{"ac":{"label":"S: Das Okapi wird auch Waldgiraffe genannt.\u2026 (2-TAF_0586)"},"identifier":657,"entityName":"sound","tab":{"id":"textsound-657","label":"S: Das Okapi wird auch Waldgiraffe genannt.\u2026 (2-TAF_0586)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=657"},"label":"S: Das Okapi wird auch Waldgiraffe genannt.\u2026 (2-TAF_0586)","value":657},{"ac":{"label":"S: Das Okapi ern\u00e4hrt sich ausschlie\u00dflich vo\u2026 (2-TAF_0587)"},"identifier":658,"entityName":"sound","tab":{"id":"textsound-658","label":"S: Das Okapi ern\u00e4hrt sich ausschlie\u00dflich vo\u2026 (2-TAF_0587)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=658"},"label":"S: Das Okapi ern\u00e4hrt sich ausschlie\u00dflich vo\u2026 (2-TAF_0587)","value":658},{"ac":{"label":"S: Wo finden Giraffen mit ihrem langen Hals\u2026 (2-TAF_0805)"},"identifier":1032,"entityName":"sound","tab":{"id":"textsound-1032","label":"S: Wo finden Giraffen mit ihrem langen Hals\u2026 (2-TAF_0805)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=1032"},"label":"S: Wo finden Giraffen mit ihrem langen Hals\u2026 (2-TAF_0805)","value":1032},{"ac":{"label":"S: Mit welchen Tieren ist das Okapi verwand\u2026 (2-TAF_0820)"},"identifier":1047,"entityName":"sound","tab":{"id":"textsound-1047","label":"S: Mit welchen Tieren ist das Okapi verwand\u2026 (2-TAF_0820)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=1047"},"label":"S: Mit welchen Tieren ist das Okapi verwand\u2026 (2-TAF_0820)","value":1047}]'),
        searchTerm: 'gira'
      }),
      eventManager: evm = new Psc.EventManagerMock({denySilent:true, allow: []}),
      delay: 100,
      minLength: 1,
      url: 'http://psc-cms.desktop.ps-webforge.net/js/fixtures/ajax/http.autocomplete.response.php',
      widget: $autoComplete
    });
    
    this.assertEquals(100, $autoComplete.autocomplete('option','delay'),'delay is put to widget');
    this.assertEquals(1, $autoComplete.autocomplete('option','minLength'), 'minlength is put to widget');
    
    // jetzt faken wir das "tippen" ins feld
    $autoComplete.simulate("focus").val( "gira" ).keydown();

    // die jquery-ui-guys machen das hier so
    setTimeout(function() {
      that.assertTrue( $autoComplete.is( ":visible" ), "menu is visible after delay" );
        //this.assertTrue(autoComplete.isOpen(), 'autoComplete isOpen() is true');
        // geht nicht verlässlich
        
        // select first
        $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
        $autoComplete.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
        
        that.assertNotFalse(evm.wasTriggered('tab-open', 1, function (e, tab, $target) {
          that.assertSame($target[0], $autoComplete[0],'target from event is the autocomplete');
          that.assertInstanceOf(Psc.UI.Tab, tab, 'event Parameter eins ist ein Psc.UI.Tab');
          return true;
        }), 'tab-open was triggered');
      
      start();
    }, 400 ); // bigger than delay
  });
  
  
  test("manual searching", function() {
    var that = setup(this), $autoComplete = that.$autoComplete;
    
    var autoComplete = new Psc.UI.AutoComplete({
      ajaxHandler: new that.ajaxHandlerMockClass({
        searchTerm: "giraffe",
        responseBody: $.parseJSON('[{"ac":{"label":"FX: Sound Giraffe rupft Bl\u00e4tter von einem Ba\u2026 (2-TAF_0078)"},"identifier":16,"entityName":"sound","tab":{"id":"fxsound-16","label":"FX: Sound Giraffe rupft Bl\u00e4tter von einem Ba\u2026 (2-TAF_0078)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=fxsound&ajaxData%5Bidentifier%5D=16"},"label":"FX: Sound Giraffe rupft Bl\u00e4tter von einem Ba\u2026 (2-TAF_0078)","value":16},{"ac":{"label":"FX: Sound Giraffe trinkt gebeugt aus einem W\u2026 (2-TAF_0084)"},"identifier":17,"entityName":"sound","tab":{"id":"fxsound-17","label":"FX: Sound Giraffe trinkt gebeugt aus einem W\u2026 (2-TAF_0084)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=fxsound&ajaxData%5Bidentifier%5D=17"},"label":"FX: Sound Giraffe trinkt gebeugt aus einem W\u2026 (2-TAF_0084)","value":17},{"ac":{"label":"S: Giraffen sind sehr interessante Tiere. W\u2026 (2-TAF_0003)"},"identifier":151,"entityName":"sound","tab":{"id":"textsound-151","label":"S: Giraffen sind sehr interessante Tiere. W\u2026 (2-TAF_0003)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=151"},"label":"S: Giraffen sind sehr interessante Tiere. W\u2026 (2-TAF_0003)","value":151},{"ac":{"label":"S: Die Giraffe findet in den Baumkronen der\u2026 (2-TAF_0033)"},"identifier":180,"entityName":"sound","tab":{"id":"textsound-180","label":"S: Die Giraffe findet in den Baumkronen der\u2026 (2-TAF_0033)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=180"},"label":"S: Die Giraffe findet in den Baumkronen der\u2026 (2-TAF_0033)","value":180},{"ac":{"label":"S: [spricht leise, ged\u00e4mpft] Wir haben sehr\u2026 (2-TAF_0049)"},"identifier":191,"entityName":"sound","tab":{"id":"textsound-191","label":"S: [spricht leise, ged\u00e4mpft] Wir haben sehr\u2026 (2-TAF_0049)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=191"},"label":"S: [spricht leise, ged\u00e4mpft] Wir haben sehr\u2026 (2-TAF_0049)","value":191},{"ac":{"label":"S: Twiga hei\u00dft Giraffe auf Swahili. Das ist\u2026 (2-TAF_0057)"},"identifier":199,"entityName":"sound","tab":{"id":"textsound-199","label":"S: Twiga hei\u00dft Giraffe auf Swahili. Das ist\u2026 (2-TAF_0057)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=199"},"label":"S: Twiga hei\u00dft Giraffe auf Swahili. Das ist\u2026 (2-TAF_0057)","value":199},{"ac":{"label":"S: Giraffen in freier Wildbahn \u2013 wie riesig\u2026 (2-TAF_0059)"},"identifier":202,"entityName":"sound","tab":{"id":"textsound-202","label":"S: Giraffen in freier Wildbahn \u2013 wie riesig\u2026 (2-TAF_0059)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=202"},"label":"S: Giraffen in freier Wildbahn \u2013 wie riesig\u2026 (2-TAF_0059)","value":202},{"ac":{"label":"S: Es w\u00e4re praktischer f\u00fcr die Giraffe, wen\u2026 (2-TAF_0067)"},"identifier":212,"entityName":"sound","tab":{"id":"textsound-212","label":"S: Es w\u00e4re praktischer f\u00fcr die Giraffe, wen\u2026 (2-TAF_0067)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=212"},"label":"S: Es w\u00e4re praktischer f\u00fcr die Giraffe, wen\u2026 (2-TAF_0067)","value":212},{"ac":{"label":"S: Lisa kennt Giraffen aus dem Zoo und wei\u00df\u2026 (2-TAF_0068)"},"identifier":213,"entityName":"sound","tab":{"id":"textsound-213","label":"S: Lisa kennt Giraffen aus dem Zoo und wei\u00df\u2026 (2-TAF_0068)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=213"},"label":"S: Lisa kennt Giraffen aus dem Zoo und wei\u00df\u2026 (2-TAF_0068)","value":213},{"ac":{"label":"S: Obwohl die Giraffen so richtig riiiiesig\u2026 (2-TAF_0069)"},"identifier":214,"entityName":"sound","tab":{"id":"textsound-214","label":"S: Obwohl die Giraffen so richtig riiiiesig\u2026 (2-TAF_0069)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=214"},"label":"S: Obwohl die Giraffen so richtig riiiiesig\u2026 (2-TAF_0069)","value":214},{"ac":{"label":"S: Vor ungef\u00e4hr zweihundert Jahren brachten\u2026 (2-TAF_0071)"},"identifier":215,"entityName":"sound","tab":{"id":"textsound-215","label":"S: Vor ungef\u00e4hr zweihundert Jahren brachten\u2026 (2-TAF_0071)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=215"},"label":"S: Vor ungef\u00e4hr zweihundert Jahren brachten\u2026 (2-TAF_0071)","value":215},{"ac":{"label":"S: Es gibt mehrere Giraffenarten und jede A\u2026 (2-TAF_0070)"},"identifier":216,"entityName":"sound","tab":{"id":"textsound-216","label":"S: Es gibt mehrere Giraffenarten und jede A\u2026 (2-TAF_0070)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=216"},"label":"S: Es gibt mehrere Giraffenarten und jede A\u2026 (2-TAF_0070)","value":216},{"ac":{"label":"S: Giraffen fressen Bl\u00fcten und Bl\u00e4tter von \u2026 (2-TAF_0079)"},"identifier":221,"entityName":"sound","tab":{"id":"textsound-221","label":"S: Giraffen fressen Bl\u00fcten und Bl\u00e4tter von \u2026 (2-TAF_0079)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=221"},"label":"S: Giraffen fressen Bl\u00fcten und Bl\u00e4tter von \u2026 (2-TAF_0079)","value":221},{"ac":{"label":"S: Mit ihren langen Beinen und dem langen H\u2026 (2-TAF_0080)"},"identifier":222,"entityName":"sound","tab":{"id":"textsound-222","label":"S: Mit ihren langen Beinen und dem langen H\u2026 (2-TAF_0080)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=222"},"label":"S: Mit ihren langen Beinen und dem langen H\u2026 (2-TAF_0080)","value":222},{"ac":{"label":"S: Giraffen k\u00f6nnen eine Gr\u00f6\u00dfe von \u00fcber f\u00fcnf\u2026 (2-TAF_0081)"},"identifier":223,"entityName":"sound","tab":{"id":"textsound-223","label":"S: Giraffen k\u00f6nnen eine Gr\u00f6\u00dfe von \u00fcber f\u00fcnf\u2026 (2-TAF_0081)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=223"},"label":"S: Giraffen k\u00f6nnen eine Gr\u00f6\u00dfe von \u00fcber f\u00fcnf\u2026 (2-TAF_0081)","value":223},{"ac":{"label":"S: Giraffen fressen am liebsten die Bl\u00e4tter\u2026 (2-TAF_0082)"},"identifier":224,"entityName":"sound","tab":{"id":"textsound-224","label":"S: Giraffen fressen am liebsten die Bl\u00e4tter\u2026 (2-TAF_0082)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=224"},"label":"S: Giraffen fressen am liebsten die Bl\u00e4tter\u2026 (2-TAF_0082)","value":224},{"ac":{"label":"S: Giraffen ruhen sich meistens im Stehen a\u2026 (2-TAF_0083)"},"identifier":225,"entityName":"sound","tab":{"id":"textsound-225","label":"S: Giraffen ruhen sich meistens im Stehen a\u2026 (2-TAF_0083)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=225"},"label":"S: Giraffen ruhen sich meistens im Stehen a\u2026 (2-TAF_0083)","value":225},{"ac":{"label":"S: Giraffen trinken am liebsten jeden Tag, \u2026 (2-TAF_0085)"},"identifier":226,"entityName":"sound","tab":{"id":"textsound-226","label":"S: Giraffen trinken am liebsten jeden Tag, \u2026 (2-TAF_0085)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=226"},"label":"S: Giraffen trinken am liebsten jeden Tag, \u2026 (2-TAF_0085)","value":226},{"ac":{"label":"S: Giraffen haben kaum Feinde, denn sie sin\u2026 (2-TAF_0086)"},"identifier":228,"entityName":"sound","tab":{"id":"textsound-228","label":"S: Giraffen haben kaum Feinde, denn sie sin\u2026 (2-TAF_0086)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=228"},"label":"S: Giraffen haben kaum Feinde, denn sie sin\u2026 (2-TAF_0086)","value":228},{"ac":{"label":"S: Hast du vielleicht im Zoo schon einmal b\u2026 (2-TAF_0087)"},"identifier":229,"entityName":"sound","tab":{"id":"textsound-229","label":"S: Hast du vielleicht im Zoo schon einmal b\u2026 (2-TAF_0087)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=229"},"label":"S: Hast du vielleicht im Zoo schon einmal b\u2026 (2-TAF_0087)","value":229},{"ac":{"label":"S: Das Fell der Giraffe verstr\u00f6mt einen str\u2026 (2-TAF_0088)"},"identifier":230,"entityName":"sound","tab":{"id":"textsound-230","label":"S: Das Fell der Giraffe verstr\u00f6mt einen str\u2026 (2-TAF_0088)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=230"},"label":"S: Das Fell der Giraffe verstr\u00f6mt einen str\u2026 (2-TAF_0088)","value":230},{"ac":{"label":"S: Wenn eine Giraffe l\u00e4ngere Zeit von einer\u2026 (2-TAF_0091)"},"identifier":233,"entityName":"sound","tab":{"id":"textsound-233","label":"S: Wenn eine Giraffe l\u00e4ngere Zeit von einer\u2026 (2-TAF_0091)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=233"},"label":"S: Wenn eine Giraffe l\u00e4ngere Zeit von einer\u2026 (2-TAF_0091)","value":233},{"ac":{"label":"S: Zebras halten sich oft in der N\u00e4he von G\u2026 (2-TAF_0135)"},"identifier":275,"entityName":"sound","tab":{"id":"textsound-275","label":"S: Zebras halten sich oft in der N\u00e4he von G\u2026 (2-TAF_0135)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=275"},"label":"S: Zebras halten sich oft in der N\u00e4he von G\u2026 (2-TAF_0135)","value":275},{"ac":{"label":"S: Das Okapi wird auch Waldgiraffe genannt.\u2026 (2-TAF_0586)"},"identifier":657,"entityName":"sound","tab":{"id":"textsound-657","label":"S: Das Okapi wird auch Waldgiraffe genannt.\u2026 (2-TAF_0586)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=657"},"label":"S: Das Okapi wird auch Waldgiraffe genannt.\u2026 (2-TAF_0586)","value":657},{"ac":{"label":"S: Das Okapi ern\u00e4hrt sich ausschlie\u00dflich vo\u2026 (2-TAF_0587)"},"identifier":658,"entityName":"sound","tab":{"id":"textsound-658","label":"S: Das Okapi ern\u00e4hrt sich ausschlie\u00dflich vo\u2026 (2-TAF_0587)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=658"},"label":"S: Das Okapi ern\u00e4hrt sich ausschlie\u00dflich vo\u2026 (2-TAF_0587)","value":658},{"ac":{"label":"S: Wo finden Giraffen mit ihrem langen Hals\u2026 (2-TAF_0805)"},"identifier":1032,"entityName":"sound","tab":{"id":"textsound-1032","label":"S: Wo finden Giraffen mit ihrem langen Hals\u2026 (2-TAF_0805)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=1032"},"label":"S: Wo finden Giraffen mit ihrem langen Hals\u2026 (2-TAF_0805)","value":1032},{"ac":{"label":"S: Mit welchen Tieren ist das Okapi verwand\u2026 (2-TAF_0820)"},"identifier":1047,"entityName":"sound","tab":{"id":"textsound-1047","label":"S: Mit welchen Tieren ist das Okapi verwand\u2026 (2-TAF_0820)","url":"\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=textsound&ajaxData%5Bidentifier%5D=1047"},"label":"S: Mit welchen Tieren ist das Okapi verwand\u2026 (2-TAF_0820)","value":1047}]')
      }),
    
      //eventManager: evm = new Psc.EventManagerMock({denySilent:true, allow: []}),
      delay: 100,
      minLength: 1,
      widget: $autoComplete,
      url: 'none'
    });

      autoComplete.search('giraffe');
      stop();

      setTimeout(function() {
        start();
        that.assertTrue(autoComplete.isOpen(),'isOpen() is true after searching');
        
        setTimeout(function() {
          $autoComplete.blur();
        },1);
      }, 600);
  });
  
  
  var testOpenItemsNum = function (test, testLabel, searchTerm, assertItemsNum) {
    var that = setup(test), $autoComplete = that.$autoComplete;
    var ajaxHandlerMockClass = Class({
      isa: Psc.AjaxHandler,
      
      override: {
        handle: function (request) {
          that.fail("ajax should never be called in avaibleItems-Mode");
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
        that.assertEquals(assertItemsNum, items.length, 'es werden '+assertItemsNum+' items für "'+searchTerm+'" angezeigt');
      });

      // trigger
      autoComplete.search(searchTerm);
      stop();

      setTimeout(function() {
        start();
        that.assertTrue(autoComplete.isOpen(),'isOpen() is true after searching '+testLabel);
        that.assertTrue(eventTriggered,'event has triggered before opening (time) '+testLabel);
      
        setTimeout(function() {
          $autoComplete.blur();
        },1);
      }, 110);
  };


  test("autocomplete ohne ajax Suche Tag:", function () {
    testOpenItemsNum(this, 'test #1', "Tag:", 5);    
  });
  
  test("autocomplete ohne ajax leere Suche", function () {
    testOpenItemsNum(this, 'test #2', "", 5);
  });
  
  test("autocomplete ohne ajax suche Prot", function () {
    testOpenItemsNum(this, 'test #3', "Prot", 1);
  });
    
  test("autocomplete ohne ajax suche Wahl", function () {
    testOpenItemsNum(this, 'test #4', "Wahl", 2);
  });

  test("notfound is triggered", function () {
    var that = setup(this), $autoComplete = that.$autoComplete;
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
      that.assertTrue(true, "notfound is triggered");
    });
    
    autoComplete.search("nix ist da");

  });
  
  asyncTest("AutoComplete Restraints Query to maxResults if Set", function () {
    var that = setup(this);
    
    var request;
    var autoComplete = new Psc.UI.AutoComplete({
      ajaxHandler: new (Class({
        isa: Psc.AjaxHandler,
      
        override: {
          handle: function (req) {
            var body = req.getBody();
            start();
            
            that.assertEquals(15, body.maxResults, 'maxResult is set in Request Body');
            
            return $.Deferred().promise();
          }
        }
      }))(),
      
      //eventManager: evm = new Psc.EventManagerMock({denySilent:true, allow: []}),
      delay: 100,
      minLength: 1,
      maxResults: 15,
      url: 'none',
      widget: that.$autoComplete
    });
    
    autoComplete.search("a"); // makes normaly a big result
  });
  
  asyncTest("todo: AutoComplete shows maxresult info hint when maxResults are given in meta in acInfo", function () {
    var that = setup(this);
    expect(0);
    start();
  });
});