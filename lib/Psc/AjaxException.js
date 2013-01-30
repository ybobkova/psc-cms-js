define('joose', ['Psc/Exception'], function (Joose) {
  Joose.Class('Psc.AjaxException', {
    isa: Psc.Exception,
  
    has: {
      textStatus: { is : 'rw', required: true, isPrivate: true }
    },
  
    methods: {
      BUILD: function(textStatus, message) {
        var props = this.SUPER(message);
        
        props.textStatus = textStatus;
        
        return props;
      },
      toString: function() {
        return "[Psc.AjaxException textStatus '"+this.getTextStatus()+"' '"+this.getMessage()+"']";
      }
    }
  });
});