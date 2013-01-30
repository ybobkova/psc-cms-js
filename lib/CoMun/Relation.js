define(['joose', 'Psc/UI/WidgetWrapper'], function(Joose) {
  Joose.Class('CoMun.Relation', {
    isa: Psc.UI.WidgetWrapper,
  
    has: {
      germanCity: { is : 'rw', required: true, isPrivate: true },
      otherCity: { is : 'rw', required: true, isPrivate: true },
      color: { is : 'rw', required: true, isPrivate: true },
      
      // wird bei draw gesetzt
      widget: { is : 'rw', required: false, isPrivate: false}
    },
    
    methods: {
      draw: function(curver) {
        //var this.unwrap() = curver.connect()
        
      },
      toString: function() {
        return "[CoMun.Relation]";
      }
    }
  });
});