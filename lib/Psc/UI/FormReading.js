define(['joose','Psc/UI/FormReader'], function(Joose) {
  /**
   * Ein Trait für ein Objekt,  welches ein Formular auslesen will
   * 
   */
  Joose.Role('Psc.UI.FormReading', {
    
    
    
    has: {
      formReader: { is : 'rw', required: false, isPrivate: true }
    },
    
    before: { // after ist bissl schlecht, weil main z.b. den eventmanager schon beim after: initialize braucht, ich weiss aber nicht wie ich steuern kann, welches "after" zuerst ausgeführt wird?, before scheint aber erstmal gut zu laufen
      initialize: function (props) {
        if (!props.formReader) {
          this.$$formReader = new Psc.UI.FormReader();
        }
      }
    },
  
    methods: {
      readForm: function ($form) {
        return this.$$formReader.read($form);
      }
    }
  });
});