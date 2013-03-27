define(['joose', 'Psc/UI/LayoutManagerComponent'], function(Joose) {
  Joose.Class('Psc.UI.LayoutManager.Li', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      serialized: { is : 'rw', required: false, isPrivate: true }
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
  
      cleanup: function () {
        var that = this;

        this.$$serialized = [];
        
        this.unwrap().find('textarea').each(function (j, ta) {
          var $ta = $(ta), text = $ta.val();
          if (that.isEmptyText(text)) { // discard empty
            $ta.slideUp(function () {
              $ta.remove();
            });
          } else {
            that.$$serialized.push(text);
          }
        });
      },

      // call cleanup before!
      serialize: function (s) {
        s.content = this.$$serialized;
      },

      // call cleanup before!
      isEmpty: function () {
        return this.$$serialized.length === 0;
      },

      toString: function() {
        return "[Psc.UI.LayoutManager.Li]";
      }
    }
  });
});