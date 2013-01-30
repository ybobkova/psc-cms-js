define(['joose', 'Psc/UI/LayoutManagerComponent'], function(Joose) {
  Joose.Class('Psc.UI.LayoutManager.Headline', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      level: { is : 'rw', required: true, isPrivate: true }
    },
    
    before: {
      initialize: function () {
        this.$$type = 'headline';
      }
    },
    
    methods: {
      createContent: function () {
        var content = this.$$content;
        return this.$$content = this.createTextfield(content);
      },
  
      toString: function() {
        return "[Psc.UI.LayoutManager.Headline]";
      }
    }
  });
});