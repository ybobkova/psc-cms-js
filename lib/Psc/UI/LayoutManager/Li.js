define(['joose', 'Psc/UI/LayoutManagerComponent'], function(Joose) {
  Joose.Class('Psc.UI.LayoutManager.Li', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
  
    before: {
      initialize: function () {
        this.$$type = 'Li';
      }
    },
    
    methods: {
      createContent: function () {
        var that = this;
        var content = this.$$content;
        if (!content) content = [""];
        
        this.$$content = "";
        $.each(content, function (i, li) {
          that.$$content += that.createTextarea(li, true);
        });
        
        this.$$content += '<p><small class="hint">Ein weiterer Aufzählungspunkt wird durch zweimal Enter drücken hinzugefügt</small></p>';
        
        return this.$$content;
      },
  
      toString: function() {
        return "[Psc.UI.LayoutManager.Li]";
      }
    }
  });
});