define(['jqwidgets', 'Psc/UI/WidgetWrapper'], function() {
  
  Joose.Class('Psc.UI.jqx.WidgetWrapper', {
    isa: Psc.UI.WidgetWrapper,
  
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      /**
       * Loads a jqWidget. give the name without jwx in front, but uppercase
       */
      jqx: function (name, options) {
        name = 'jqx'+name;
        this.unwrap()[name](options || {});
      },
      toString: function() {
        return "[Psc.UI.jqx.WidgetWrapper]";
      }
    }
  });
});