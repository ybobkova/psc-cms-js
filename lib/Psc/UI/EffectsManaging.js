define(['joose', 'Psc/UI/EffectsManager'], function(Joose) {
  /**
   * Ein Trait für ein Objekt welches einen EffectsManager benutzt
   * 
   */
  Joose.Role('Psc.UI.EffectsManaging', {
    
    has: {
      effectsManager: { is : 'rw', required: false, isPrivate: true }
    },
    
    before: { // after ist bissl schlecht, weil main z.b. den eventmanager schon beim after: initialize braucht, ich weiss aber nicht wie ich steuern kann, welches "after" zuerst ausgeführt wird?, before scheint aber erstmal gut zu laufen
      initialize: function (props) {
        if (!props.effectsManager) {
          this.$$effectsManager = new Psc.UI.EffectsManager();
        }
      }
    }
  });
});  