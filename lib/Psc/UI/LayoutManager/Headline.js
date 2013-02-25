define(['joose', 'Psc/UI/LayoutManagerComponent'], function(Joose) {
  Joose.Class('Psc.UI.LayoutManager.Headline', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      // 1-based
      level: { is : 'rw', required: true, isPrivate: true } 
    },
    
    before: {
      initialize: function () {
        this.$$type = 'Headline';
      }
    },
    
    methods: {
      createContent: function () {
        var content = this.$$content;
        return this.$$content = this.createTextfield(content);
      },
      
      initLabel: function (guessedLabel) {
        if (!this.$$label) {
          if (this.$$level === 1) {
            this.$$label = 'Überschrift';
          } else {
            this.$$label = 'Zwischenüberschrift';
            
            if (this.$$level > 2) {
              this.$$label += ' '+this.$$level
            }
          }
        }
      },
      toString: function() {
        return "[Psc.UI.LayoutManager.Headline]";
      }
    }
  });
});