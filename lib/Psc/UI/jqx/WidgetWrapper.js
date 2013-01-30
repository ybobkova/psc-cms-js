define(['joose', 'jqwidgets', 'jqwidgets-global', 'Psc/UI/WidgetWrapper'], function(Joose) {  
  Joose.Class('Psc.UI.jqx.WidgetWrapper', {
    isa: Psc.UI.WidgetWrapper,
  
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      /**
       * Loads a jqWidget. give the name without jqx in front, but uppercase
       *
       * if no widget is given, this.unwrap() is used
       * [widget, ] name, options
       */
      jqx: function (name, options) {
        var $widget;
        if (arguments.length === 3) {
          $widget = arguments[0];
          name = arguments[1];
          options = arguments[2];
        } else {
          $widget = this.unwrap();
        }
        
        name = 'jqx'+name;
        $widget[name](options || {});
      },
      toString: function() {
        return "[Psc.UI.jqx.WidgetWrapper]";
      }
    }
  });
});