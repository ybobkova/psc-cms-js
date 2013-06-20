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
      
      serialize: function(s) {
        s.content = this.unwrap().find('input').val();
        s.level = this.getLevel();
      },

      isEmpty: function() {
        return this.isEmptyText(this.unwrap().find('input').val());
      },

      toString: function() {
        return "[Psc.UI.LayoutManager.Headline]";
      }
    }
  });
});