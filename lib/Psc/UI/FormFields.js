Joose.Class('Psc.UI.FormFields', {
  
  does: ['Psc.UI.FormBuilding'],
  
  use: ['Psc.UI.FormReader', 'Psc.Exception', 'Psc.Code'],
  
  has: {
    formReader: { is : 'rw', required: false, isPrivate: true },
    
    /**
     * Ein Feld kann haben
     *
     * field.name
     * field.label  ist dies leer wird immer der name genommen
     * field.type  ("string"|choice) @TODO mehr
     * field.value
     *
     * bei type choice muss field.values gesetzt sein (object value : label)
     *
     * indiziert nach name: ist ein plainObject
     */
    fields: { is : 'rw', required: false, isPrivate: true }
  },
  
  after: {
    initialize: function (props) {
      if (!props.formReader) {
        this.$$formReader = new Psc.UI.FormReader();
      }
      
      if (props.fields) {
        this.$$fields = {};
        this._expandFields(props.fields);
      } else {
        this.$$fields = {};
      }
    }
  },
  
  methods: {
    
    /**
     * Gibt mithilfe des Formbuilders ein Formular zurück
     */
    createForm: function() {
      var that = this, fb = this.$$formBuilder;
      
      fb.open();
      
      $.each(this.$$fields, function(name, field) {
        //Psc.Code.debug('creating form component for: ',field);
        if (field.type === 'choice') {
          fb.radios(field.label,
                    field.name,
                    field.value,
                    field.values
                   );
        } else if(field.type === 'string') {
          fb.textField(
            field.label,
            field.name,
            field.value
          );
        } else {
          Psc.Code.debug('fehlerhalftes Field:', field);
          throw new Psc.Exception('Type des Fields: '+field.type+' kann nicht in den FormBuilder übersetzt werden');
        }
      });
      
      return fb.build();
    },
    
    /**
     * es MUSS gesetzt sein
     * .label
     * .name
     * .type (zu was sinnvollem)
     * .value (geht undefined)
     *
     * + mögliche Felder die der type braucht
     */
    setField: function(expandedField) {
      this.$$fields[ expandedField.name ] = expandedField;
      return this;
    },
    
    getField: function(name) {
      return this.$$fields[name];
    },
    
    _expandFields: function (fields) {
      //Psc.Code.debug('im expanding', fields);
      var that = this;
      $.each(fields, function(name, field) {
        var expanded = that._expandField(name, field);
        //Psc.Code.debug('expanding', field,'to', expanded);
        that.setField(expanded);
      });
    },

    _expandField: function(name, value) {
      var field = {
        name: name,
        value: undefined,
        label: name
      };
      if ("string" === typeof(value)) {
        field.type = value;
      } else if($.isPlainObject(value)) {
        $.extend(field, value);
      } else {
        throw new Psc.Exception('Unbekanntes format für den Wert eines Feldes (bis jetzt nur string type und das field als plain object(expert mode))');
      }

      return field;
    },
    
    readFrom: function ($form) {
      var readData = this.$$formReader.read($form), data = {};
      
      $.each(this.$$fields, function (name, field) {
        // validate data?
        data[name] = readData[name]; // wenn dies nicht gelesen werden konnte, ist das undefined
      });
      
      return data;
    },
    
    toString: function() {
      return "[Psc.UI.FormFields]";
    }
  }
});