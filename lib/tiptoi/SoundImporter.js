define(['joose', 'Psc/UI/jqx/WidgetWrapper'], function(Joose) {
  Joose.Class('tiptoi.SoundImporter', {
    isa: Psc.UI.jqx.WidgetWrapper,
  
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      toString: function() {
        return "[tiptoi.SoundImporter]";
      }
    }
  });
});