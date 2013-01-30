define(['joose', 'JSON', 'Psc/Code', 'Psc/InvalidArgumentException'], function(Joose) {
  /**
   * Der Widget initializer kann widgets initialisieren, die mit dem neuen Loading System geladen werden
   *
   * <button data-widget="button" data-widget-options="">
   *
   * daraus macht der widget initializer dann
   *
   * button.button({});
   * 
   */
  Joose.Class('Psc.UI.WidgetInitializer', {
    
    has: {
    },
    
    methods: {
      /**
       * Initialisiert ein Widget, sofern es ein valides html element ist und noch nicht initialisiert wurde
       *
       * failed silently
       */
      init: function ($widget) {
        if ($widget.jquery && $widget.length) {
          var widgetName = $widget.attr('data-widget');
          
          if (widgetName) {
            var widget = $widget.data(widgetName);
            
            if (!widget) {
              var widgetOptionsJSON = $widget.attr('data-widget-options'),
                  widgetOptions = JSON.parse(widgetOptionsJSON) || {};
              
              this.hookForWidget(widgetName, $widget);
              
              $widget[widgetName](widgetOptions);
              $widget.removeClass('widget-not-initialized');
            }
          }
        }
      },
      
      
      hookForWidget: function(widgetName, $widget) {
        if (widgetName === 'button') {
          // entferne das innere span weil jquery-ui zu doof ist
          var $span = $widget.find('.ui-button-text'), label = $span.html();
          
          if ($span.length) {
            $span.remove();
            $widget.append(label);
          }
        }
      },
      
      /**
       * Initializiert alle widgets, die noch nicht initialisiert sind in $container
       */
      initWidgetsIn: function ($container) {
        var that = this;
        Psc.Code.info('initializing widgets in', $container);
        if ($container.jquery) {
          var $widgets = $container.find('.widget-not-initialized').each(function (i, widget) {
            that.init($(widget));
          });
        }
      }
    }
  });
});