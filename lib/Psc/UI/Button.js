Joose.Class('Psc.UI.Button', {
  
  has: {
    label: { is : 'rw', required: false, isPrivate: true, init:"" },
    leftIcon: { is : 'rw', required: false, isPrivate: true },
    rightIcon: { is : 'rw', required: false, isPrivate: true },
    
    options: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
    widget: { is : 'rw', required: false, isPrivate: true }
  },
  
  methods: {
    create: function () {
      this.$$widget = $('<button class="psc-cms-ui-button">'+(this.$$label === ' ' ? '&nbsp;' : this.$$label)+'</button>');
      
      this.$$widget.button(this.getMergedOptions());
      
      return this.$$widget;
    },
    getUIIcons: function () {
      return {
        primary: this.$$leftIcon ? 'ui-icon-'+this.$$leftIcon : null,
        secondary: this.$$rightIcon ? 'ui-icon-'+this.$$rightIcon : null
      };
    },
    getMergedOptions: function () {
      return $.extend({icons: this.getUIIcons()}, this.$$options);
    },
    
    toString: function() {
      return "[Psc.UI.Button]";
    }
  }
});