define(
  ['psc-tests-assert',
   'text!fixtures/tiptoi/FEE-Game1.tito',
   'text!fixtures/tiptoi/tito-editor.html',
   'text!fixtures/tiptoi/FEE-Game1.html',
   'text!fixtures/tiptoi/FEE-Game1.sync.tito',
   'text!fixtures/tiptoi/sync-exception.txt',
   'jquery-simulate',
   'tiptoi/TitoGameEditor',
   'Psc/UI/WidgetWrapper',
   'Psc/CMS/FastItem',
   'Psc/AjaxResponse',
   'Psc/Response'
   ],
  function(t, titoSourceCode, html, titoHighlighted, syncedTito, syncExceptionText) {
  
  module("tiptoi.TitoGameEditor");
  
  var setup = function(test, options) {
    options = options || {};
    
    var $widget = $('#visible-fixture').empty().html(html);
    
    var service = new (Joose.Class({
      has: {
        pulledCalled: {is: 'rw', required: false, isPrivate: false, init: false}
      },
      
      methods: {
        createRequest: function(urlParts, method, body, format) {
          if (!method) { method = 'GET'; }
          if (!format) { format = 'json'; }
    
          var request = new Psc.Request({
            url: '/api/product/test/'+urlParts.join('/'),
            method: method,
            body: body,
            format: format
          });
          
          return request;
        },

        dispatch: function (request) {
          var d = $.Deferred();
          
          setTimeout(function () {
            if (request.getUrl() === '/api/product/test/tito/highlight') {
              d.resolve(new Psc.AjaxResponse({
                request: request,
                body: titoHighlighted,
                code: 200
              }));
            } else if (request.getUrl() === '/api/product/test/tito/synchronize') {
              if (options.synchronizeResponse) {
                if (options.synchronizeResponse.getCode() === 200) {
                  d.resolve(options.synchronizeResponse);
                } else {
                  d.reject(options.synchronizeResponse);
                }
              } else {
                d.resolve(new Psc.AjaxResponse({
                  request: request,
                  body: {
                    tito: syncedTito,
                    log: "alles hat geklappt"
                  },
                  code: 200
                }));
              }
            } else {
              d.reject(new Psc.AjaxResponse({
                request: request,
                body: request.getUrl()+' not found',
                code: 404
              }));
            }
          }, 120);
          
          return d.promise();
        }
      }
    }))();
    
    var editor = new tiptoi.TitoGameEditor({
        service: service,
        widget: $widget,
        tito: titoSourceCode,
        gameNum: 1
    });
    
    return t.setup(test, {
      editor: editor,
      evm: editor.getEventManager(),
      $widget: $widget
    });
  };

  asyncTest("tito is displayed in pre, buttons are cms fastitems", function() {
    var that = setup(this);
    
    that.evm.on('code-loaded', function () {
      var $pre = that.assertjQueryLength(1, that.$widget.find('div.content pre'));
    
      that.assertContains('#!tito', $pre.text());
      
      // buttons
      var $buttons = that.assertjQueryLengthGT(2, $pre.find('.psc-cms-ui-button'), 'there are more than 2 buttons in the code');
      
      $buttons.each(function () {
        var $button = $(this);
        var item = Psc.UI.WidgetWrapper.unwrapWidget($button, Psc.CMS.FastItem);
        
      });
      
      start();
    });
  });
  
  asyncTest('when clicked on sync button, tito sync is loaded into pre', function () {
    var that = setup(this);
    
    var initialLoad = true;
    
    // first load
    that.evm.on('code-loaded', function () {
      
      if (initialLoad) {
        stop();
        initialLoad = false;
        var $button = that.assertjQueryLength(1, that.$widget.find('button.psc-cms-ui-button.sync-button'), 'sync button is found');

        start();
        $button.simulate('click');
      } else {
        var $pre = that.assertjQueryLength(1, that.$widget.find('div.content pre'));
        
        // das geht nicht weil wir den service für get highlighted ja gemocked haben!
        //that.assertContains('(2-FEE_023)', $pre.text(), 'the synced sound nummer is in text for pre');
        
        start();
      }
    });
  });
  
  asyncTest("when synchronize response does not work a dialog is shown", function () {
    var that = setup(this, {
      synchronizeResponse: new Psc.Response({
        body: syncExceptionText,
        code: 500,
        header: {
          'X-Psc-CMS-Error-Message': "In der Datenbank wurde '2-EAE_0620' als Nummer gefunden, es wurde jedoch '2-DRA_0736' angegeben.. #8761 Text: 'Probiere es einfach noch mal' D:\\www\\tiptoi\\Umsetzung\\base\\src\\tiptoi\\SoundPersister.php:289",
          'X-Psc-CMS-Error': 'true'
        }
      })
    });

    var $button = that.assertjQueryLength(1, that.$widget.find('button.psc-cms-ui-button.sync-button'), 'sync button is found');

    var initialLoad = true;
    
    that.evm.on('error', function (e, response, dialog) {
      that.assertTrue(dialog.isOpen(), 'dialog is open');
      
      dialog.close();
      that.assertEquals(500, response.getCode());
      
      start();
    });

    $button.simulate('click');
  });
});