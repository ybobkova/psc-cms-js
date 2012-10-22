define(['Psc/UI/WidgetWrapper'], function () {
  Joose.Class('CoMun.City', {
    isa: Psc.UI.WidgetWrapper,
    
    has: {
      // wird von map gesetzt, wird vor draw gesetzt
      widget: { is : 'rw', required: false, isPrivate: false},
      editMode: { is : 'rw', required: false, isPrivate: true, init: false},
      
      // jede stadt ist immer abgespeichert
      id: { is : 'rw', required: true, isPrivate: true},
      
      // das jquery element für das label
      label: { is : 'rw', required: false, isPrivate: true },
      labelPosition: { is : 'rw', required: true, isPrivate: true }, // .top .left
      //labelAt: { is : 'rw', required: true, isPrivate: true }, // left|right
      
      // wird nach construct gesetzt, ist immer da (integer)
      guid: { is : 'rw', required: false, isPrivate: true },
      
      // string
      name: { is : 'rw', required: true, isPrivate: true },
      marked: { is : 'rw', required: true, isPrivate: true }, // projekthauptstadt?
      type: { is : 'rw', required: true, isPrivate: true }, // german|other
  
      // das jquery element für den punkt
      point: { is : 'rw', required: false, isPrivate: true },
      // die Position des Punkes: .top .left
      position: { is : 'rw', required: true, isPrivate: true }
    },
    
    methods: {
      draw: function () {
        var $point = this.initPoint(true), $label = this.initLabel(true);
        //var labelWidth = $label.outerWidth(), labelHeight = $label.outerHeight();
        
        $point
          .css('left', this.$$position.left+'px')
          .css('top', this.$$position.top+'px');
  
        $label.css({
          'left':this.$$labelPosition.left+'px',
          'top':this.$$labelPosition.top+'px'
        });
      },
      initPoint: function (checkIfExists) {
        if (!this.$$point) {
          this.$$point = this.unwrap().find('#city-'+this.$$id);
        
          if (!this.$$point.length) {
            this.$$point = $('<div id="city-'+this.$$id+'" title="'+this.$$name+' '+this.$$id+'" class="comun-city-point"></div>');
            
            if (this.$$marked) {
              this.$$point.addJoose.Class('comun-marked-point');
            }
            
            this.unwrap().append(this.$$point);
            
            if (this.$$editMode) {
              this.$$point.draggable({});
            }
          }
        }
        
        return this.$$point;
      },
      initLabel: function (checkIfExists) {
        if (!this.$$label) {
          this.$$label = this.unwrap().find('#city-label-'+this.$$id);
        
          if (!this.$$label.length) {
            this.$$label = $('<span id="city-label-'+this.$$id+'" class="comun-city-label">'+(!this.$$name ? '' : this.$$name)+'</span>');
            this.unwrap().append(this.$$label);
  
            if (this.$$editMode) {
              this.$$label.draggable({});
            }
          }
        }
        
        return this.$$label;
      },
      
      enableDragging: function() {
        if (this.$$label) this.$$label.draggable('enable');
        if (this.$$point) this.$$point.draggable('enable');
      },
      disableDragging: function() {
        if (this.$$label) this.$$label.draggable('disable');
        if (this.$$point) this.$$point.draggable('disable');
      },
      
      refresh: function () {
        if (this.$$label) { // wenn wirs nicht haben, kann die position sich auch nicht verändert habe
          this.$$labelPosition = this.$$label.position(); // das sit schon relativ und hat top+left
        }
        
        if (this.$$point) {
          this.$$position = this.$$point.position();
        }
      },
      
      getPosition: function () {
        return {
          top: Math.round(this.$$position.top),
          left: Math.round(this.$$position.left)
        };
      },
      
      serialize: function() {
        this.refresh();
        
        return {
          id: this.$$id,
          name: this.$$name,
          labelPosition: this.$$labelPosition,
          position: this.$$position
        };
      },
      toString: function() {
        return "[CoMun.City]";
      }
    }
  });
});