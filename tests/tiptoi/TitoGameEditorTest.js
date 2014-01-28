define(
  ['psc-tests-assert',
   'joose',
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
  function(t, Joose, titoSourceCode, html, titoHighlighted, syncedTito, syncExceptionText) {
  
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
});