/**
 * Ein Trait für ein Objekt welche einen FormBuilder benutzen
 * 
 */
Joose.Role('Psc.UI.FormBuilding', {
  
  use: ['Psc.UI.FormBuilder'],
  
  has: {
    formBuilder: { is : 'rw', required: false, isPrivate: true }
  },
  
  before: { // after ist bissl schlecht, weil main z.b. den eventmanager schon beim after: initialize braucht, ich weiss aber nicht wie ich steuern kann, welches "after" zuerst ausgeführt wird?, before scheint aber erstmal gut zu laufen
    initialize: function (props) {
      if (!props.formBuilder) {
        this.$$formBuilder = new Psc.UI.FormBuilder();
      }
    }
  },

  methods: {
  }
});