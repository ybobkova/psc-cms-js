define(['jquery', 'joose', 'Psc/Exception'], function ($, Joose) {
  Joose.Class('Psc.UI.Button', {
    
    has: {
      label: { is : 'rw', required: false, isPrivate: true, init:"" },
      leftIcon: { is : 'rw', required: false, isPrivate: true },
      rightIcon: { is : 'rw', required: false, isPrivate: true },
      
      // required when label is not given
      title: { is : 'rw', required: false, isPrivate: true },
      
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
        
        if (!this.hasLabel() && this.$$title === undefined) {
          throw new Psc.Exception('You have to set title, when label is undefined');
        }
      }
    },
    
    methods: {
      create: function () {
        var buttonText;
        
        if (this.hasLabel()) {
          buttonText = (this.$$label === ' ' ? '&nbsp;' : this.$$label);
        } else {
          buttonText = this.$$title;
        }
        
        this.$$widget = $('<button class="psc-cms-ui-button">'+buttonText+'</button>');
        
        this.$$widget.button(this.getMergedOptions());
        
        this.bindEvents(this.$$widget);
        
        return this.$$widget;
      },
      getUIIcons: function () {
        return {
          primary: this.$$leftIcon ? 'ui-icon-'+this.$$leftIcon : null,
          secondary: this.$$rightIcon ? 'ui-icon-'+this.$$rightIcon : null
        };
      },
      
      bindEvents: function (widget) {
        var event;
        for (event in this.$$bindings) {
          widget.on(event, this.$$bindings[event]);
        }
      },
      getMergedOptions: function () {
        var options = $.extend({icons: this.getUIIcons()}, this.$$options);
        
        if (!this.hasLabel()) { // see init in var
          options.text = false;
        }
  
        return options;
      },
      
      hasLabel: function () {
        return this.$$label !== '';
      },
      
      toString: function() {
        return "[Psc.UI.Button]";
      }
    }
  });
});