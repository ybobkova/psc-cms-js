define(
  ['psc-tests-assert',
   'text!fixtures/tiptoi/FEE-Game1.tito',
   'text!fixtures/tiptoi/tito-editor.html',
   'text!fixtures/tiptoi/FEE-Game1.html',
   'tiptoi/TitoGameEditor',
   'Psc/AjaxResponse'
   ],
  function(t, titoSourceCode, html, titoHighlighted) {
  
  module("tiptoi.TitoGameEditor");
  
  var setup = function(test, options) {
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
        tito: titoSourceCode
    });
    
    return t.setup(test, {
      editor: editor,
      evm: editor.getEventManager(),
      $widget: $widget
    });
  };

  asyncTest("tito is displayed in pre", function() {
    var that = setup(this);
    
    that.evm.on('code-loaded', function () {
      var $pre = that.assertjQueryLength(1, that.$widget.find('div.content pre'));
    
      that.assertContains('#!tito', $pre.text());
      start();
    });
  });
});