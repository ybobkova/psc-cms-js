define(['jquery', 'joose', 'Psc/UI/LayoutManager/TemplateWidget'], function ($, Joose) {
  Joose.Class('Psc.UI.LayoutManager.Teaser', {
    isa: Psc.UI.LayoutManager.TemplateWidget,
    
    has: {
      
    },
    
    before: {
      initialize: function () {
        this.$$type = 'Teaser';
      }
    },
    
    methods: {
      createContent: function () {
        return this.render(this.expandVariables({
          
          headline: { type: "text", description: "Überschrift des Teasers", defaultValue: "die Überschrift" }

        }));
      },
      toString: function () {
        return '[Psc.UI.LayoutManager.Teaser]';
      }
    }
  });
});