define(['joose', 'Psc/UI/LayoutManagerComponent'], function(Joose) {
  Joose.Class('Psc.UI.LayoutManager.WebsiteWidget', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      name: { is : 'rw', required: true, isPrivate: true }
    },
  
    before: {
      initialize: function () {
        this.$$type = 'WebsiteWidget';
      }
    },
    
    methods: {
      createContent: function () {
        return this.$$content = "Dies ist ein spezielles Widget, welches nicht konfiguriert werden kann.";
      },
      
      initLabel: function (guessedLabel) {
        if (!this.$$label) {
          this.$$label = 'unknown website-widget';
        }
      },
  
      toString: function() {
        return "[Psc.UI.LayoutManager.WebsiteWidget]";
      }
    }
  });
});