define(['Psc/UI/Controller'], function() {
  /**
   * Ein Trait für ein Objekt welches den UI Controller benutzt, um mit dem UI zu kommunizieren
   */
  Joose.Role('Psc.UI.Controlling', {
    
    has: {
      uiController: { is : 'rw', required: true, isPrivate: true }
    },
    
    methods: {
      getUIController: function () {
        return this.$$uiController;
      }
    }
  });
});