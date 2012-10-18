/**
 * @todo ein automatisches "sync" für options die wir sowohl im joose als auch im jquery-ui-widget haben wäre geil
 */
Joose.Class('Psc.UI.WidgetWrapper', {
  
  use: ['Psc.Code', 'Psc.InvalidArgumentException'],
  
  has: {
    widget: { is : 'rw', required: true, isPrivate: false },
    guid: { is : 'rw', required: false, isPrivate: true }
  },
  
  my: {
    methods: {
      /**
       * Überprüft ob das Widget mit einem WidgetWrapper belegt ist welcher von der Klasse constructor ist
       *
       */
      unwrapWidget: function ($widget, constructor) {
        if (!$.isEmptyObject($widget) && $widget.jquery && $widget.length) {
          var joose = $widget.data('joose');
          
          if (joose && (constructor === undefined || Psc.Code.isInstanceOf(joose, constructor))) {
            return joose;
          }
        }
        
        Psc.Code.debug('exception widget', $widget);
        throw new Psc.InvalidArgumentException('$widget', 'jquery Objekt mit data("joose") mit der Klasse '+constructor+' erwartet. Kann nicht unwrappen.', $widget, constructor.toString(), 'WidgetWrapper::unwrapWidget()');
      }
    }
  },

  methods: {
    checkWidget: function() {
      //$.isEmptyObject(this.widget) || 
      if (!this.widget || !this.widget.jquery || this.widget.length === 0) {
        Psc.Code.debug(this.widget);
        throw new Psc.InvalidArgumentException('widget', 'jquery Objekt mit einem gematchten element.', this.widget, this.toString());
      }
    },
    linkWidget: function () {
      $.data(this.widget[0], 'joose', this);
    },
    
    unwrap: function () {
      return this.widget;
    },
    guid: function (id) {
      if (this.$$guid) {
        this.widget.removeJoose.Class('psc-guid-'+this.$$guid); // does not matter if exists
      }
      
      this.$$guid = id;
      this.widget.addJoose.Class('psc-guid-'+id);
      return this;
    },
    toString: function() {
      return "[Psc.UI.WidgetWrapper]";
    }
  }
});