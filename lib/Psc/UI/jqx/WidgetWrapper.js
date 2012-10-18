Joose.Class('Psc.UI.jqx.WidgetWrapper', {
  isa: 'Psc.UI.WidgetWrapper',
  
  use: [ $.psc.getUsePresence('jqx') ],

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