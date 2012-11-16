define(['Psc/Table', 'Psc/EventDispatching', 'Psc/UI/Button', 'Psc/Numbers', 'Psc/UI/Dialog', 'Psc/UI/WidgetWrapper'], function() {
  Joose.Class('tiptoi.TitoGameEditor', {
    isa: Psc.UI.WidgetWrapper,
    
    does: Psc.EventDispatching,
  
    has: {
      service: { is : 'rw', required: true, isPrivate: true }, // ein AjaxService
      tito: { is : 'rw', required: true, isPrivate: true } // string
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
            $panel = this.unwrap();
        
        
        // append code in a pre
        this.$$service.dispatch(
          this.$$service.createRequest(
            ['tito','highlight'],
            'POST',
            {tito: that.$$tito},
            'html'
          )
        ).done(function (response) {
          $panel.find('fieldset.tito-game-editor div.content').first().append(
            '<pre>'+(response.getBody())+'</pre>'
          );
          
          that._trigger('code-loaded', [response.getBody()]);
          that.refreshCode();
        });
        
        return this;
      },
      
      refreshCode: function () {
        var that = this;
        that.findCode().find('span.token-sound.real').each(function (i, soundToken) {
          var $soundToken = $(soundToken),
              button = new Psc.UI.Button({
                label: $soundToken.html()
              });
              
          $soundToken.replaceWith(button.create());
        });
      },
      
      findCode: function () {
        return this.unwrap().find('fieldset.tito-game-editor div.content pre');
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