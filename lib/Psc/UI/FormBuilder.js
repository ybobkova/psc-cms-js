define(['joose', 'Psc/UI/Component'], function(Joose) {
  /**
   *
   * usage:
   *
   * does: [Psc.UI.FormBuilding],
   * [...]
   *
   * var fb = this.$$formBuilder;
   * 
   * fb.open();
   *   fb.textBox(),
   *   fb.textField(),
   *   usw
   * var $form = fb.build();
   *
   * diese klasse ist noch sehr basic:
   * 1. objekt zurückgeben bei allen Funktionen geht noch nicht. trotzdem unbedingt html() benutzen
   * 2. labels für alle funktionen gehen noch nicht
   *
   * @TODO subklasse für alle form-componenten machen, vll aus php compilen?
   */
  Joose.Class('Psc.UI.FormBuilder', {
    
    has: {
      form: { is : 'rw', required: false, isPrivate: true },
      components: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      open: function () {
        this.$$components = [];
        return this.$$form = $('<form class="psc-cms-ui-form" />');
      },
      
      build: function () {
        return this.$$form;
      },
      
      _component: function(label, name, value, $widget) {
        var component = new Psc.UI.Component({
          name: name,
          label: label,
          value: value,
          widget: $widget
        });
        
        this.$$components.push(component);
        this.$$form.append(component.html()); // das kann später mal in build
        
        return component;
      },
      
      textBox: function (label, name, value) {
        return this._component(
          label, name, value,
          $('<textarea/>').attr('name',this._generateName(name)).html(value)
        );
      },
      
      textField: function(label, name, value) {
        var $field = $('<input type="text"/>') // type immer angeben sonst gehts nicht in IE http://api.jquery.com/jQuery/#jQuery2
                    .attr('name',this._generateName(name))
                    .attr('class','text ui-widget-content ui-corner-all')
                    .val(value);
        
        return this._component(label, name, value, $field);
      },
      
      /**
       * @param object values  value => label
       * @param string checkedValue der aktuell ausgewählte punkt (kann falsy sein)
       */
      radios: function(label, name, checkedValue, values) {
        var that = this, component;
        var $radios = $('<div class="radios-wrapper" />');
        name = this._generateName(name);
        
        $.each(values, function (value, label) {
          var $radio = $('<input id="radio-'+name+'-'+value+'-'+that._generateRand()+'" type="radio" name="'+name+'" value="'+value+'" />');
          
          if (value === checkedValue) {
            $radio.attr('checked','checked');
          }
          
          $radios.append($radio);
          $radios.append($('<label>'+label+'</label>').attr('for', $radio.attr('id')));
        });
        
        // attach
        component = this._component(label, name, checkedValue,
                                    $radios
                                   );
        
        // dann buttonset (ist vll safer)
        $radios.buttonset();
        return component;
      },
      
      _generateName: function (name) {
        if ($.isArray(name)) {
          return name[0]+name.slice(1).map(function (part) { return '['+part+']'; } ).join("");
        }
  
        return name;
      },
      
      _generateRand: function () {
        function S4() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
         
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
      },
      
      toString: function() {
        return "[Psc.UI.FormBuilder]";
      }
    }
  });
});  