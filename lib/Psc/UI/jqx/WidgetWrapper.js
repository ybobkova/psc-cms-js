Joose.Class('Psc.UI.jqx.WidgetWrapper', {
  isa: Psc.UI.WidgetWrapper,
  
  define([ $.psc.getUsePresence('jqx') ], function() {

  has: {
    //attribute1: { is : 'rw', required: false, isPrivate: true }
  },
  
  methods: {
    jqx: function (name, options) {
      name = 'jqx'+name;
      this.unwrap()[name](options || {});
    },
    toString: function() {
      return "[Psc.UI.jqx.WidgetWrapper]";
    }
  }
});