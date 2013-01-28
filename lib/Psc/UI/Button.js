Joose.Class('Psc.UI.Button', {
  
  has: {
    label: { is : 'rw', required: false, isPrivate: true, init:"" },
    leftIcon: { is : 'rw', required: false, isPrivate: true },
    rightIcon: { is : 'rw', required: false, isPrivate: true },
    
    options: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
    widget: { is : 'rw', required: false, isPrivate: true },
    
    bindings: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
    
    // some non specified data for the button (easier to attach for events)
    data: { is : 'rw', required: false, isPrivate: true }
  },
  
  after: {
    initialize: function (props) {
      if (props.click && $.isFunction(props.click)) {
        this.$$bindings['click'] = props.click;
      }
    }
  },
  
  methods: {
    create: function () {
      this.$$widget = $('<button class="psc-cms-ui-button">'+(this.$$label === ' ' ? '&nbsp;' : this.$$label)+'</button>');
      
      this.$$widget.button(this.getMergedOptions());
      
      var event;
      for (event in this.$$bindings) {
        this.$$widget.on(event, this.$$bindings[event]);
      }
      
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