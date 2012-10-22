define(function () {
  Joose.Class('Psc.Exception', {
    
    has: {
      message: { is : 'rw', required: true },
      name: { is : 'rw', required: true, init: 'Exception' }
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
      toString: function() {
        return "["+this.getName()+" with Message '"+this.getMessage()+"']";
      }
    }
  });
});