define(['Psc/Table', 'Psc/EventDispatching', 'Psc/UI/EffectsManaging', 'Psc/UI/Button', 'Psc/Numbers', 'Psc/UI/Dialog', 'Psc/UI/WidgetWrapper'], function() {
  Joose.Class('tiptoi.TitoGameEditor', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.EventDispatching, Psc.UI.EffectsManaging],
  
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
            $panel = this.unwrap(),
            $content = $panel.find('fieldset:eq(0) div.content').first();
        
        // add a button to synchronize the sounds to the db
        var syncButton = new Psc.UI.Button({
          label: 'Sounds in der Datenbank speichern',
          leftIcon: 'disk'
        }), $syncButton;
        
        var $set = $('<div class="psc-cms-ui-buttonset psc-cms-ui-buttonset-right"></div>').css('float', 'right');
        $set.append($syncButton = syncButton.create().addClass('sync-button'));
        
        $content.append($set);
        $set.after('<div class="clear" />');
        
        $syncButton.on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          
          that.$$service.dispatch(
            that.$$service.createRequest(
              ['tito','synchronize'],
              'POST',
              {tito: that.$$tito},
              'json'
            )
          ).done(function (response) {
            // replace pre with new tito
            that.setTito(response.getBody().tito);
            $content.find('pre').remove();
            
            that.loadCode($content);
            that.getEffectsManager().successBlink($syncButton);
            
            
          }).fail(function (response) {
            that.getEffectsManager().errorBlink($syncButton);
            
            alert('das speichern der sounds hat nicht geklappt');
          });
        })
        
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
            '<pre>'+(response.getBody())+'</pre>'
          );
          
          that._trigger('code-loaded', [response.getBody()]);
          that.refreshCode();
        });
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