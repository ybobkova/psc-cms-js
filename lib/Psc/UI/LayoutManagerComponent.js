define(['Psc/UI/WidgetWrapper', 'Psc/UI/EffectsManaging', 'Psc/UI/EffectsManaging', 'Psc/EventDispatching', 'Psc/UI/FormBuilding'], function () {
  Joose.Class('Psc.UI.LayoutManagerComponent', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.UI.EffectsManaging, Psc.UI.FormBuilding, Psc.EventDispatching],
  
    has: {
      widget: { is : 'rw', required: false, isPrivate: false },
      
      type: { is : 'rw', required: false, isPrivate: true},
      label: { is : 'rw', required: true, isPrivate: true},
      
      content: { is : 'rw', required: false, isPrivate: true}
    },
    
    after: {
      initialize: function () {
        // assert: type, label
      }
    },
    
    methods: {
      /**
       * Initialisiert das HTML des Widgets
       * 
       */
      create: function () {
        var $widget, that = this;
        
        this.widget = $widget = 
          $('<div class="widget '+this.$$type+'"><h3 class="widget-header"></h3><div class="widget-content"></div></div>')
            .addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all')
            .on('click', '.widget-header span.ui-icon-close', function(e) {
              e.preventDefault();
              that.remove();
          })
          .css('margin-bottom','5px');
        
          $widget.find('.widget-header')
            .html(this.$$label)
            .addClass("ui-helper-reset ui-state-default ui-corner-all" )
            .prepend("<span class='ui-icon ui-icon-close'></span>")
            .css({
              padding: '0.5em 0.5em 0.5em 0.7em'
            })
            .find('.ui-icon')
              .css({
                'float':'right',
                cursor: 'pointer'  
              });
          
          this.createContent();
          $widget.find('.widget-content')
            .append(this.getContent())
            .css('padding', '1.1em');
        
        this.linkWidget();
        
        return this.unwrap();
      },        
      createContent: function () {
        // sollte von jedem ableitenden widget implementiert werden. setzt this.$$content mit einem append()-baren jquery part
      },
      
      
      createTextarea: function (content, plain) {
        if (!content) content = '';
        
        var html = '<textarea class="paragraph" name="disabled[layout-manager-component]" cols="120" rows="5" style="width: 100%; min-height: 120px">'+content+'</textarea>';
        return plain ? html : $(html);
      },
      
      createTextfield: function(content) {
        if (!content) content = '';
        
        return $('<input type="text" style="width: 100%" name="disabled[layout-manager-component]" value="'+content+'" />');
      },
      
      remove: function () {
        var $widget = this.unwrap();
        this.getEffectsManager().disappear($widget, function () {
          $widget.remove();
        });
      },
      
      _trigger: function (eventName, handlerData) {
        return this.getEventManager().triggerEvent(eventName, {component: this}, handlerData);
      },
      
      toString: function() {
        return "[Psc.UI.LayoutManagerComponent]";
      }
    }
  });
});