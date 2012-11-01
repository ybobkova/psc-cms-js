define(['Psc/UI/jqx/WidgetWrapper'], function () {
  Joose.Class('Psc.UI.DatePicker', {
    isa: Psc.UI.jqx.WidgetWrapper,

    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
  
    methods: {
      toString: function() {
        return "[Psc.UI.DatePicker]";
      }
    }
  });
});