Joose.Class('Psc.UI.SplitPane', {
  
  does: 'Psc.UI.HTML.Base',
  
  has: {
    width: { is : 'rw', required: false, isPrivate: true, init: 50 }, // in percent
    space: { is : 'rw', required: false, isPrivate: true, init: 1 } // in percent

  },
  
  after: {
    initialize: function (props) {
      if (props.rightContent || props.leftContent) {
        this.refresh();

        if (props.rightContent) {
          this.getRightTag().append(props.rightContent);
        }

        if (props.leftContent) {
          this.getLeftTag().append(props.leftContent);
        }
      }
    }
  },
  
  methods: {
    refresh: function () {
      if (!this.$$html) {
        var avaibleWidth = 100;
        var leftSpace = Math.floor(this.$$space/2);
        var rightSpace = this.$$space - leftSpace;
      
        var left = this.$$width-leftSpace;
        var right = (avaibleWidth-this.$$width)-rightSpace;

        this.$$html = $('<div class="psc-cms-ui-splitpane">'+
                      '<div style="float: left; width: '+this.$$width+'%; height: 100%; margin-right: '+this.$$space+'%" class="left"></div>'+
                      '<div style="float: left; width: '+right+'%; height: 100%;" class="right"></div>'+
                      '<div style="clear: left"></div>'+
                      '</div>'
                    );
      }
    },
    getLeftTag: function () {
      return this.$$html.find('> div.left');
    },
    getRightTag: function () {
      return this.$$html.find('> div.right');
    },
    toString: function() {
      return "[Psc.UI.SplitPane]";
    }
  }
});