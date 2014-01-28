define(['joose', 'jquery', 'Psc/TableModel', 'Psc/EventDispatching', 'Psc/CMS/FastItem', 'Psc/UI/EffectsManaging', 'Psc/UI/Button', 'Psc/Numbers', 'Psc/UI/Dialog', 'Psc/UI/WidgetWrapper', 'Psc/AjaxResponseErrorHandler'], function(Joose, $) {
  Joose.Class('tiptoi.TitoGameEditor', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.EventDispatching, Psc.UI.EffectsManaging],
  
    has: {
      service: { is : 'rw', required: true, isPrivate: true }, // ein AjaxService
      tito: { is : 'rw', required: true, isPrivate: true }, // string
      gameNum: { is : 'rw', required: true, isPrivate: true } // int
    },
    
    after: {
      initialize: function (props) {
        this.checkWidget();
        this.linkWidget();
        
        this.initUI();
      }
    },
    
    methods: {
      initUI: function () {
        var that = this,
            $panel = this.unwrap(),
            $content = $panel.find('fieldset:eq(0) div.content').first();
        
        that.loadCode($content);
        
        return this;
      },
      
      loadCode: function ($content) {
        var that = this;
        
        // append code in a pre
        this.$$service.dispatch(
          this.$$service.createRequest(
            ['tito','highlight'],
            'POST',
            {tito: that.$$tito},
            'html'
          )
        ).done(function (response) {
          $content.append(
            '<pre style="overflow:hidden">'+(response.getBody())+'</pre>'
          );
          
          that.loadButtons();
          that._trigger('code-loaded', [response.getBody()]);
        });
      },
      
      loadButtons: function () {
        var that = this;
        that.findCode().find('span.token-sound.real').each(function (i, soundToken) {
          var $soundToken = $(soundToken);
          var ident = $soundToken.attr('data-ident');
          
          if (ident) {
            var button = new Psc.UI.Button({
                label: $soundToken.html()
              }),
              $widget = button.create(),
              url = that.$$service.createRequest(['sound', ident, 'form']).getUrl();

            // ersetze text mit button
            $soundToken.replaceWith($widget);
          
            var item = new Psc.CMS.FastItem({
              widget: $widget,
              
              button: {
                label: button.getLabel(),
                mode: 1
              },
            
              identifier: ident,
              entityName: 'sound',
              
              tab: {
                label: $soundToken.attr('data-text')+' ('+ident+')',
                id: url.replace(/\//g, '-').substr(1),
                url: url
              }
            });
          }
        });
      },
      
      findCode: function () {
        return this.unwrap().find('fieldset:eq(0) div.content pre');
      },
      
      toString: function() {
        return "[tiptoi.GameEditor]";
      },
      
      _trigger: function(eventName, data) {
        return this.getEventManager().triggerEvent(eventName, {}, data);
      }
    }
  });
});