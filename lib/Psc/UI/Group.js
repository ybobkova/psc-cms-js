define(['Psc/UI/HTML/Base'], function () {
  Joose.Class('Psc.UI.Group', {
    
    does: [Psc.UI.HTML.Base],
    
    has: {
      label: { is : 'rw', required: true, isPrivate: true },
      content: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      refresh: function () {
        if (!this.$$html) {
          this.$$html = $('<fieldset class="psc-cms-ui-group ui-corner-all ui-widget-content"><legend>'+this.$$label+'</legend><div class="content"></div></div>');
          
          if (this.$$content) {
            this.getContentTag().append(this.$$content);
          }
        }
      },
      getContentTag: function () {
        return this.$$html.find('div.content');
      },
      
      toString: function() {
        return "[Psc.UI.Group]";
      }
    }
  });
});