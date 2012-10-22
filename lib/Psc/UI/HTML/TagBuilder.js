define(function () {
  /**
   * Ein sehr sehr sehr simpler, schneller TagBuilder
   *
   * wichtig: dies ist ein Builder und kein Tag-Wrapper
   * somit hat man keine chance ein "geschriebenes" attribut zu modifizieren
   *
   * (new Psc.UI.HTML.TagBuilder({name: 'div', attributes: {'title': 'de', class: 'ui-widget-default'))
   *   .setAttribute('title', 'de')
   *   .setStyle('width', '100%')
   *   .addJoose.Class('forgot-in-constructor')
   */
  Joose.Class('Psc.UI.HTML.TagBuilder', {
    
    has: {
      name: { is : 'rw', required: true, isPrivate: true },
      attributes: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      classes: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      style: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      type: { is : 'rw', required: false, isPrivate: true, init: 'normal' }
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      // style oder class überschreibt hier alle vorherigen hinzugefügten
      setAttribute: function (name, value) {
        this.$$attributes[name] = value;
        return this;
      },
      
      // does not check if class already is in attributes.class
      addClass: function(cls) {
        this.$$attributes['class'] = ' '+cls;
        return this;
      },
      
      setStyle: function(key, value) {
        this.$$attributes.style = 'key:'+value+';';
        return this;
      },
      
      build: function () {
        var q = '"';
        
        var tag = '<'+this.$$name+'>';
      },
      
      toString: function() {
        return "[Psc.UI.HTML.TagBuilder]";
      }
    }
  });
});