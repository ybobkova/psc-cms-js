define(['jquery', 'joose', 'Psc/UI/InteractionProvider'], function ($, Joose) {
  Joose.Role('Psc.UI.InteractionProviding', {
    has: {
      interactionProvider: { is : 'rw', required: false, isPrivate: true }
    },

    before: {
      initialize: function (props) {
        if (!props.interactionProvider) {
          this.$$interactionProvider = new Psc.UI.InteractionProvider();
        }
      }
    },
    
    methods: {
      interactivePrompt: function (message, defaultValue) {
        return this.$$interactionProvider.prompt(message, defaultValue);
      },
      interactiveConfirm: function (message) {
        return this.$$interactionProvider.confirm(message);
      }
    }
  });
});