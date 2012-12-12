define(['Psc/UI/jqx/WidgetWrapper'], function () {
  Joose.Class('Psc.UI.jqx.I18nWrapper', {
    isa: Psc.UI.jqx.WidgetWrapper,
  
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        this.linkWidget();
        this.initUI();
      }
    },
    
    methods: {
      initUI: function () {
        this.jqx('Tabs', {
          selectionTracker: true,
          animationType: 'fade',
          keyboardNavigation: false
        });
      },
      toString: function() {
        return "[Psc.UI.jqx.I18nWrapper]";
      }
    }
  });
});