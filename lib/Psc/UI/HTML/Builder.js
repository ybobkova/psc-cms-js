define(['joose','jquery'], function (Joose, $) {
  Joose.Class('Psc.UI.HTML.Builder', {
    
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      
      /**
       * Gibt für einen Style Array einen String zurück
       *
       * background-color: "bla", next: "bla" usw
       */
      buildStyle: function (styleMap) {
        var str = '';
        var key, value;
        for (key in styleMap) {
          value = styleMap[key];
          str += key+': '+value+'; ';
        }
        
        return str.substr(0,str.length-2);
      },
      
      buildTag: function (name, attributes, options) {
        var attr, tag, q = '"';
        
        if (attributes.style && typeof(attributes.style) !== 'string') {
          attributes.style = this.buildStyle(attributes.style);
        }
        
        if (attributes.classes) {
          attributes['class'] += ' '+this.buildClasses(attributes.classes);
        }
        
        if (attributes) {
          for (attr in attributes) {
            tag += ' '+attr+'='+q+attributes[attr]+q;
          }
        }
        
        tag += '>';
        return tag;
      },
      /** 
       * @return HTML TagBuilder
       */
      tag: function (name) {
        
      },
      buildClasses: function (classes) {
        return classes.join(' ');
      },
      toString: function() {
        return "[Psc.UI.HTML.Builder]";
      }
    }
  });
});