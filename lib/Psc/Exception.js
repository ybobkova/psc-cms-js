define(['joose'], function(Joose) {
  Joose.Class('Psc.Exception', {
    
    has: {
      message: { is : 'rw', required: true },
      name: { is : 'rw', required: true, init: 'Exception' },
      trace: { is : 'rw', isPrivate: false, required: false, init: Joose.I.Array }
    },
    
    methods: {
      BUILD: function (message, name) {
        if (!name) {
          name = this.meta.name;
        }
        
        this.$$name = name;
        this.$$message = message;
        
        return {
          message: message,
          name: name
        };
        
      },
      getTraceAsString: function () {
        return this.trace.join("\n    ");
      },
      toString: function() {
        return "["+this.getName()+" with Message '"+this.getMessage()+"']\nStackTrace:\n    "+this.getTraceAsString();
      }
    }
  });
});